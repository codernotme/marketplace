from collections.abc import Callable
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import get_settings
from app.core.database import get_db
from app.core.store import store
from app.utils.jwt_utils import verify_token

security = HTTPBearer(auto_error=False)
settings = get_settings()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict[str, Any]:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    try:
        payload = verify_token(credentials.credentials)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token") from exc

    user_id = payload.get("sub")
    if settings.use_in_memory:
        user = store.users.get(user_id)
    else:
        db = await get_db()
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def require_role(role: str) -> Callable[..., Any]:
    async def checker(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        if user.get("role") != role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return user

    return checker
