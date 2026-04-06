from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from core.config import get_settings
from core.database import DatabaseManager
from core.tenant import load_active_tenant, resolve_tenant_identifier
from routers.saas.router import router as saas_router
from routers.shop.router import router as shop_router
from routers.shop.webhooks import router as webhook_router
from utils.serialize import to_jsonable

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    db_manager = DatabaseManager()
    await db_manager.startup()
    app.state.db_manager = db_manager
    try:
        yield
    finally:
        await db_manager.shutdown()


app = FastAPI(
    title=settings.app_name,
    debug=settings.app_debug,
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)

if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.middleware("http")
async def tenant_middleware(request: Request, call_next):
    # Only shop API routes require tenant resolution.
    if request.url.path.startswith("/api/shop/"):
        db_manager: DatabaseManager = request.app.state.db_manager
        tenant_identifier = resolve_tenant_identifier(request)
        tenant = await load_active_tenant(db_manager.master_db, tenant_identifier)
        request.state.tenant = tenant
        request.state.tenant_db = await db_manager.get_tenant_db(tenant)
    response = await call_next(request)
    return response


@app.get("/health")
async def health(request: Request):
    db_manager: DatabaseManager = request.app.state.db_manager
    await db_manager.ping()
    return {"status": "ok", "env": settings.app_env}


@app.get("/")
async def root():
    return {"name": settings.app_name, "status": "running"}


app.include_router(saas_router)
app.include_router(shop_router)
app.include_router(webhook_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception):
    return ORJSONResponse(status_code=500, content={"error": {"code": "INTERNAL_ERROR", "message": str(exc)}})


@app.exception_handler(ValueError)
async def value_error_handler(_: Request, exc: ValueError):
    return ORJSONResponse(status_code=400, content={"error": {"code": "VALUE_ERROR", "message": str(exc)}})
