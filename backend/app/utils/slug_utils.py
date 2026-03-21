import re


def generate_slug(title: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9\s-]", "", title).strip().lower()
    return re.sub(r"[\s-]+", "-", value)


def ensure_unique_slug(existing_slugs: set[str], slug: str) -> str:
    if slug not in existing_slugs:
        return slug
    suffix = 2
    while f"{slug}-{suffix}" in existing_slugs:
        suffix += 1
    return f"{slug}-{suffix}"
