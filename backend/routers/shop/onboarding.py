from __future__ import annotations

from fastapi import APIRouter, Depends

from core.dependencies import get_master_db, get_tenant, get_tenant_db, require_roles
from core.security import hash_password
from schemas.shop import OnboardingStep1, OnboardingStep2, OnboardingStep3, VerificationResponse
from services.email_service import send_email
from services.razorpay_service import razorpay_healthcheck
from services.telegram_service import send_telegram
from services.tenant_config_service import get_tenant_config, patch_tenant_config
from utils.time import utcnow

router = APIRouter(prefix="/onboarding", tags=["shop-onboarding"])


@router.get("/status")
async def onboarding_status(tenant=Depends(get_tenant)):
    return {
        "data": {
            "step": tenant.get("onboarding_step", 1),
            "completed": tenant.get("onboarding_completed", False),
        }
    }


@router.post("/step/1")
async def step_1(
    payload: OnboardingStep1,
    tenant=Depends(get_tenant),
    master_db=Depends(get_master_db),
    _: dict = Depends(require_roles(["shop_admin"])),
):
    await master_db["tenants"].update_one(
        {"_id": tenant["_id"]},
        {
            "$set": {
                "name": payload.shop_name,
                "tagline": payload.tagline,
                "logo_url": payload.logo_url,
                "primary_color": payload.primary_color,
                "owner_email": payload.contact_email,
                "owner_phone": payload.contact_phone,
                "onboarding_step": 2,
                "updated_at": utcnow(),
            }
        },
    )
    return {"next_step": 2}


@router.post("/step/2")
async def step_2(
    payload: OnboardingStep2,
    tenant=Depends(get_tenant),
    tenant_db=Depends(get_tenant_db),
    master_db=Depends(get_master_db),
    _: dict = Depends(require_roles(["shop_admin"])),
):
    await tenant_db["users"].update_one(
        {
            "tenant_id": tenant["_id"],
            "email": payload.email.lower(),
            "role": "shop_admin",
        },
        {
            "$set": {
                "password_hash": hash_password(payload.password),
                "is_email_verified": True,
                "updated_at": utcnow(),
            }
        },
        upsert=False,
    )
    if payload.resend_api_key:
        await patch_tenant_config(master_db, str(tenant["_id"]), {"resend_api_key": payload.resend_api_key})

    await master_db["tenants"].update_one(
        {"_id": tenant["_id"]}, {"$set": {"onboarding_step": 3, "updated_at": utcnow()}}
    )
    return {"next_step": 3}


@router.post("/step/3")
async def step_3(
    payload: OnboardingStep3,
    tenant=Depends(get_tenant),
    master_db=Depends(get_master_db),
    _: dict = Depends(require_roles(["shop_admin"])),
):
    patch = {
        "razorpay_key_id": payload.razorpay_key_id,
        "razorpay_key_secret": payload.razorpay_key_secret,
        "telegram_bot_token": payload.telegram_bot_token,
        "telegram_chat_id": payload.telegram_chat_id,
    }
    if payload.dedicated_db_uri:
        patch["dedicated_db_uri"] = payload.dedicated_db_uri

    await patch_tenant_config(master_db, str(tenant["_id"]), patch)

    db_updates = {"onboarding_step": 4, "updated_at": utcnow()}
    if payload.dedicated_db_uri and payload.dedicated_db_name:
        db_updates.update(
            {
                "db_mode": "dedicated",
                "db_uri": payload.dedicated_db_uri,
                "db_name": payload.dedicated_db_name,
            }
        )

    await master_db["tenants"].update_one({"_id": tenant["_id"]}, {"$set": db_updates})
    return {"next_step": 4}


@router.post("/step/4/verify", response_model=VerificationResponse)
async def step_4_verify(
    tenant=Depends(get_tenant),
    master_db=Depends(get_master_db),
    _: dict = Depends(require_roles(["shop_admin"])),
):
    config = await get_tenant_config(master_db, str(tenant["_id"]))
    result = {"razorpay": "failed", "telegram": "failed", "resend": "failed"}

    try:
        await razorpay_healthcheck(config.get("razorpay_key_id", ""), config.get("razorpay_key_secret", ""))
        result["razorpay"] = "ok"
    except Exception:
        pass

    try:
        await send_telegram(
            config.get("telegram_bot_token", ""),
            config.get("telegram_chat_id", ""),
            "theMrktPlace connected successfully.",
        )
        result["telegram"] = "ok"
    except Exception:
        pass

    try:
        if config.get("resend_api_key"):
            await send_email(
                config["resend_api_key"],
                tenant.get("owner_email"),
                "theMrktPlace Email Check",
                "<p>Resend is connected.</p>",
            )
            result["resend"] = "ok"
    except Exception:
        pass

    return result


@router.post("/step/5/complete")
async def step_5_complete(
    tenant=Depends(get_tenant),
    master_db=Depends(get_master_db),
    _: dict = Depends(require_roles(["shop_admin"])),
):
    await master_db["tenants"].update_one(
        {"_id": tenant["_id"]},
        {
            "$set": {
                "onboarding_completed": True,
                "onboarding_step": 5,
                "updated_at": utcnow(),
            }
        },
    )
    return {"message": "Onboarding completed"}
