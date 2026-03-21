import asyncio
import sys
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.database import close_db, init_db
from app.core.exceptions import register_exception_handlers
from app.core.redis import close_redis, get_redis, init_redis
from app.modules.admin.router import router as admin_router
from app.modules.analytics.router import router as analytics_router
from app.modules.auth.router import router as auth_router
from app.modules.cart.router import router as cart_router
from app.modules.categories.router import router as categories_router
from app.modules.inventory.router import router as inventory_router
from app.modules.orders.router import router as orders_router
from app.modules.payments.router import router as payments_router
from app.modules.products.router import router as products_router
from app.modules.recommendations.router import router as recommendations_router
from app.modules.reviews.router import router as reviews_router
from app.modules.users.router import router as users_router
from app.modules.vendor.router import router as vendor_router

settings = get_settings()

if sys.platform.startswith("win"):
    # redis.asyncio has intermittent issues with Proactor loop on Windows in tests.
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_db()
    await init_redis()
    yield
    await close_redis()
    await close_db()


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.state.rate_limit_cache = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)


@app.middleware("http")
async def security_and_rate_limit_middleware(request: Request, call_next):
    protected_paths = {
        ("POST", f"{settings.api_prefix}/auth/login"),
        ("POST", f"{settings.api_prefix}/auth/register"),
    }

    method_and_path = (request.method.upper(), request.url.path)
    if method_and_path in protected_paths:
        key = f"rl:{request.url.path}:{request.client.host if request.client else 'unknown'}"
        limit = 5

        if settings.use_in_memory:
            now = datetime.now(timezone.utc)
            cache = app.state.rate_limit_cache
            entry = cache.get(key)
            if not entry or entry["reset_at"] <= now:
                entry = {"count": 0, "reset_at": now + timedelta(minutes=1)}
                cache[key] = entry
            entry["count"] += 1
            if entry["count"] > limit:
                return JSONResponse(status_code=429, content={"detail": "Too many requests"})
        else:
            redis = await get_redis()
            try:
                count = await redis.incr(key)
                if count == 1:
                    await redis.expire(key, 60)
                if count > limit:
                    return JSONResponse(status_code=429, content={"detail": "Too many requests"})
            finally:
                aclose = getattr(redis, "aclose", None)
                if callable(aclose):
                    await aclose()

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response


@app.get("/health")
async def health() -> dict[str, str | bool]:
    return {"status": "ok", "in_memory": settings.use_in_memory}


app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(users_router, prefix=settings.api_prefix)
app.include_router(categories_router, prefix=settings.api_prefix)
app.include_router(products_router, prefix=settings.api_prefix)
app.include_router(cart_router, prefix=settings.api_prefix)
app.include_router(orders_router, prefix=settings.api_prefix)
app.include_router(payments_router, prefix=settings.api_prefix)
app.include_router(inventory_router, prefix=settings.api_prefix)
app.include_router(vendor_router, prefix=settings.api_prefix)
app.include_router(recommendations_router, prefix=settings.api_prefix)
app.include_router(analytics_router, prefix=settings.api_prefix)
app.include_router(reviews_router, prefix=settings.api_prefix)
app.include_router(admin_router, prefix=settings.api_prefix)
