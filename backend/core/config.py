from __future__ import annotations

from functools import lru_cache
from typing import Any

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = Field(default="theMrktPlace Backend", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    app_debug: bool = Field(default=True, alias="APP_DEBUG")
    app_host: str = Field(default="0.0.0.0", alias="APP_HOST")
    app_port: int = Field(default=8000, alias="APP_PORT")

    cors_origins: list[str] = Field(default_factory=list, alias="CORS_ORIGINS")

    mongo_master_uri: str = Field(alias="MONGO_MASTER_URI")
    mongo_shared_uri: str = Field(alias="MONGO_SHARED_URI")
    mongo_master_db: str = Field(default="mrkt_master", alias="MONGO_MASTER_DB")
    mongo_shared_db: str = Field(default="mrkt_shared", alias="MONGO_SHARED_DB")
    mongo_max_pool_size: int = Field(default=200, alias="MONGO_MAX_POOL_SIZE")
    mongo_min_pool_size: int = Field(default=5, alias="MONGO_MIN_POOL_SIZE")

    jwt_secret_key: str = Field(alias="JWT_SECRET_KEY")
    jwt_refresh_secret_key: str = Field(alias="JWT_REFRESH_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=15, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    encryption_key: str = Field(default="", alias="ENCRYPTION_KEY")

    default_from_email: str = Field(default="no-reply@themrktplace.com", alias="DEFAULT_FROM_EMAIL")
    resend_api_base: str = Field(default="https://api.resend.com", alias="RESEND_API_BASE")
    razorpay_api_base: str = Field(default="https://api.razorpay.com/v1", alias="RAZORPAY_API_BASE")

    telegram_webhook_secret: str = Field(default="", alias="TELEGRAM_WEBHOOK_SECRET")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_origins(cls, value: Any) -> list[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        return []


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
