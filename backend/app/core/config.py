from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Marketplace API"
    app_env: str = "development"
    api_prefix: str = "/api/v1"
    use_in_memory: bool = Field(default=True, alias="USE_IN_MEMORY")
    mongodb_uri: str = Field(default="mongodb://localhost:27017", alias="MONGODB_URI")
    mongodb_db_name: str = Field(default="marketplace_db", alias="MONGODB_DB_NAME")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    jwt_secret: str = "change_me_access"
    jwt_refresh_secret: str = "change_me_refresh"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    allowed_origins_raw: str = Field(default="http://localhost:3000", alias="ALLOWED_ORIGINS")
    frontend_url: str = Field(default="http://localhost:3000", alias="FRONTEND_URL")
    resend_api_key: str | None = Field(default=None, alias="RESEND_API_KEY")
    resend_from_email: str = Field(default="Marketplace <no-reply@marketplace.local>", alias="RESEND_FROM_EMAIL")

    @property
    def allowed_origins(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins_raw.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
