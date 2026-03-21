from fastapi import UploadFile


async def upload_image(file: UploadFile, folder: str) -> str:
    return f"/{folder}/{file.filename}"


async def delete_image(public_id: str) -> None:
    return None


def get_optimized_url(public_id: str, width: int, quality: int) -> str:
    return f"{public_id}?w={width}&q={quality}"
