from __future__ import annotations

from fastapi import HTTPException, status


class APIError(HTTPException):
    def __init__(self, code: str, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail={"code": code, "message": message})


class UnauthorizedError(APIError):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__("UNAUTHORIZED", message, status.HTTP_401_UNAUTHORIZED)


class ForbiddenError(APIError):
    def __init__(self, message: str = "Forbidden"):
        super().__init__("FORBIDDEN", message, status.HTTP_403_FORBIDDEN)


class NotFoundError(APIError):
    def __init__(self, message: str = "Not found"):
        super().__init__("NOT_FOUND", message, status.HTTP_404_NOT_FOUND)


class ConflictError(APIError):
    def __init__(self, message: str = "Conflict"):
        super().__init__("CONFLICT", message, status.HTTP_409_CONFLICT)
