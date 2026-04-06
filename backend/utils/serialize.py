from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from bson import ObjectId


def to_jsonable(value):
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, list):
        return [to_jsonable(item) for item in value]
    if isinstance(value, dict):
        output = {}
        for key, item in value.items():
            out_key = "id" if key == "_id" else key
            output[out_key] = to_jsonable(item)
        return output
    return value
