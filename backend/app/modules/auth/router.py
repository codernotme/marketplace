from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.modules.auth.schemas import (
    ForgotPasswordRequest,
    LoginRequest,
    OTPVerifyRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenPair,
    UserResponse,
)
from app.modules.auth.service import (
    get_current_user as get_current_user_by_id,
    login,
    logout,
    refresh_access_token,
    register_user,
    request_password_reset,
    reset_password,
    verify_otp as verify_otp_service,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest):
    user = await register_user(data)
    return UserResponse(**{k: user[k] for k in ["id", "name", "email", "role", "is_active"]})


@router.post("/verify-otp", response_model=TokenPair)
async def verify_otp(data: OTPVerifyRequest):
    return await verify_otp_service(data)


@router.post("/login", response_model=TokenPair)
async def login_route(data: LoginRequest):
    return await login(data)


@router.post("/refresh")
async def refresh(data: RefreshRequest):
    token = await refresh_access_token(data.refresh_token)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/logout")
async def logout_route(data: RefreshRequest):
    await logout(data.refresh_token)
    return {"ok": True}


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    await request_password_reset(data.email)
    return {"ok": True}


@router.post("/reset-password")
async def reset_password_route(data: ResetPasswordRequest):
    await reset_password(data.token, data.new_password)
    return {"ok": True}


@router.get("/me", response_model=UserResponse)
async def me(user=Depends(get_current_user)):
    full_user = await get_current_user_by_id(user["id"])
    return UserResponse(**{k: full_user[k] for k in ["id", "name", "email", "role", "is_active"]})
