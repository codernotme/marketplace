# Ecommerce Core — Shared Data Schemas

All collections below live per-tenant (either in a shared DB with `tenant_id` scoping, or a dedicated DB per tenant on higher plans).

---

## 1. Users / Customers

### `users`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "name": "string",
  "email": "string",
  "phone": "string | null",
  "password_hash": "string | null (null if OAuth/OTP only)",
  "avatar_url": "string | null",
  "role": "customer | vendor | shop_admin",
  "is_email_verified": "boolean",
  "is_phone_verified": "boolean",
  "is_active": "boolean",
  "auth_provider": "local | google | otp",
  "addresses": [
    {
      "id": "string (uuid)",
      "label": "Home | Work | Other",
      "full_name": "string",
      "phone": "string",
      "line1": "string",
      "line2": "string | null",
      "city": "string",
      "state": "string",
      "pincode": "string",
      "country": "string",
      "is_default": "boolean"
    }
  ],
  "wishlist": ["ObjectId (ref: products)"],
  "total_orders": "number",
  "total_spent": "number",
  "tags": ["string (e.g. 'vip', 'at-risk')"],
  "notes": "string (admin-only)",
  "created_at": "datetime",
  "last_login": "datetime"
}
```

---

## 2. Categories

### `categories`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "name": "string",
  "slug": "string",
  "description": "string | null",
  "image_url": "string | null",
  "icon": "string | null (icon name or SVG)",
  "parent_id": "ObjectId | null (for sub-categories)",
  "level": "number (0=root, 1=sub, 2=sub-sub)",
  "sort_order": "number",
  "is_active": "boolean",
  "seo": {
    "title": "string | null",
    "description": "string | null",
    "keywords": ["string"]
  },
  "product_count": "number (denormalized, updated async)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## 3. Products

### `products`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "vendor_id": "ObjectId | null (ref: users where role=vendor)",
  "title": "string",
  "slug": "string (unique per tenant)",
  "description": "string (rich HTML)",
  "short_description": "string | null",
  "category_id": "ObjectId",
  "sub_category_id": "ObjectId | null",
  "brand": "string | null",
  "sku": "string | null",

  "price": "number",
  "compare_price": "number | null (strike-through price)",
  "cost_price": "number | null (for margin calc)",
  "tax_rate": "number (percentage, e.g. 18 for GST)",
  "tax_inclusive": "boolean",

  "images": [
    {
      "url": "string",
      "alt": "string",
      "sort_order": "number",
      "is_primary": "boolean"
    }
  ],

  "variants": [
    {
      "id": "string (uuid)",
      "name": "string (e.g. 'Red / XL')",
      "options": { "Color": "Red", "Size": "XL" },
      "sku": "string | null",
      "price": "number | null (overrides base if set)",
      "compare_price": "number | null",
      "stock": "number",
      "weight": "number | null",
      "images": ["string (url)"]
    }
  ],

  "attributes": [
    { "name": "string", "value": "string" }
  ],

  "stock": "number (total, used when no variants)",
  "low_stock_threshold": "number (default: 5)",
  "track_inventory": "boolean",
  "allow_backorder": "boolean",

  "weight": "number | null (kg)",
  "dimensions": {
    "length": "number | null",
    "width": "number | null",
    "height": "number | null"
  },

  "tags": ["string"],
  "status": "draft | active | archived",
  "visibility": "public | hidden | password_protected",

  "flags": {
    "is_new": "boolean",
    "is_trending": "boolean",
    "is_featured": "boolean",
    "is_best_seller": "boolean",
    "is_digital": "boolean"
  },

  "ratings_avg": "number",
  "ratings_count": "number",

  "seo": {
    "title": "string | null",
    "description": "string | null",
    "keywords": ["string"]
  },

  "related_product_ids": ["ObjectId"],
  "upsell_product_ids": ["ObjectId"],

  "created_at": "datetime",
  "updated_at": "datetime",
  "published_at": "datetime | null"
}
```

---

## 4. Reviews

### `reviews`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "product_id": "ObjectId",
  "user_id": "ObjectId",
  "order_id": "ObjectId | null (verified purchase link)",
  "rating": "number (1-5)",
  "title": "string | null",
  "body": "string",
  "images": ["string (url)"],
  "status": "pending | approved | rejected",
  "helpful_count": "number",
  "admin_reply": "string | null",
  "created_at": "datetime"
}
```

---

## 5. Orders

### `orders`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "order_number": "string (e.g. 'MKT-2024-00123', sequential per tenant)",
  "user_id": "ObjectId | null (null = guest checkout)",
  "guest_info": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },

  "items": [
    {
      "product_id": "ObjectId",
      "variant_id": "string | null",
      "title": "string (snapshot)",
      "image_url": "string (snapshot)",
      "sku": "string | null",
      "quantity": "number",
      "unit_price": "number (at time of order)",
      "compare_price": "number | null",
      "tax_rate": "number",
      "tax_amount": "number",
      "discount_amount": "number",
      "subtotal": "number"
    }
  ],

  "shipping_address": {
    "full_name": "string",
    "phone": "string",
    "line1": "string",
    "line2": "string | null",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "country": "string"
  },

  "billing_address": "same shape as shipping_address | null (null = same as shipping)",

  "pricing": {
    "subtotal": "number",
    "shipping_fee": "number",
    "tax_total": "number",
    "discount_total": "number",
    "coupon_discount": "number",
    "grand_total": "number"
  },

  "coupon_code": "string | null",
  "coupon_id": "ObjectId | null",

  "payment": {
    "method": "razorpay | cod | wallet | upi",
    "status": "pending | paid | failed | refunded | partially_refunded",
    "razorpay_order_id": "string | null",
    "razorpay_payment_id": "string | null",
    "razorpay_signature": "string | null",
    "paid_at": "datetime | null",
    "amount_paid": "number"
  },

  "fulfillment": {
    "status": "pending | processing | packed | shipped | out_for_delivery | delivered | cancelled | returned | refunded",
    "tracking_number": "string | null",
    "courier": "string | null",
    "tracking_url": "string | null",
    "estimated_delivery": "date | null",
    "delivered_at": "datetime | null"
  },

  "notes": "string | null (customer note)",
  "admin_notes": "string | null",
  "source": "web | mobile | admin",

  "timeline": [
    {
      "status": "string",
      "note": "string",
      "created_by": "system | admin | user",
      "created_at": "datetime"
    }
  ],

  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## 6. Coupons / Discounts

### `coupons`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "code": "string (uppercase, unique per tenant)",
  "description": "string | null",
  "type": "percentage | fixed | free_shipping | buy_x_get_y",
  "value": "number (% or ₹)",
  "min_order_value": "number | null",
  "max_discount": "number | null (cap for percentage type)",
  "applicable_to": "all | category | product",
  "applicable_ids": ["ObjectId"],
  "usage_limit": "number | null",
  "usage_per_user": "number | null",
  "used_count": "number",
  "is_active": "boolean",
  "starts_at": "datetime | null",
  "expires_at": "datetime | null",
  "created_at": "datetime"
}
```

---

## 7. Banners / Ads

### `banners`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "title": "string",
  "subtitle": "string | null",
  "image_url": "string",
  "mobile_image_url": "string | null",
  "link_type": "product | category | url | none",
  "link_value": "string | null",
  "placement": "hero | mid_banner | sidebar | popup | announcement_bar",
  "sort_order": "number",
  "is_active": "boolean",
  "starts_at": "datetime | null",
  "expires_at": "datetime | null",
  "click_count": "number",
  "impression_count": "number",
  "created_at": "datetime"
}
```

---

## 8. Inventory Logs

### `inventory_logs`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "product_id": "ObjectId",
  "variant_id": "string | null",
  "type": "sale | restock | manual_adjust | return",
  "quantity_change": "number (negative for deductions)",
  "quantity_before": "number",
  "quantity_after": "number",
  "reference_id": "ObjectId | null (order_id for sales)",
  "note": "string | null",
  "created_by": "system | ObjectId",
  "created_at": "datetime"
}
```

---

## 9. Delivery Zones & Shipping

### `shipping_zones`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "name": "string",
  "regions": ["string (state/pincode prefix/country)"],
  "methods": [
    {
      "id": "string",
      "name": "string (e.g. 'Standard', 'Express')",
      "type": "flat_rate | free | weight_based | price_based",
      "rate": "number",
      "free_above": "number | null",
      "estimated_days": "string (e.g. '3-5 days')"
    }
  ],
  "is_active": "boolean"
}
```

---

## 10. Notifications / Emails Log

### `notification_logs`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "user_id": "ObjectId | null",
  "channel": "email | sms | telegram | push",
  "type": "order_confirmed | order_shipped | otp | password_reset | etc",
  "recipient": "string",
  "subject": "string | null",
  "body_preview": "string",
  "status": "sent | failed | pending",
  "provider_message_id": "string | null",
  "created_at": "datetime"
}
```

---

## 11. Customer Queries / Support

### `queries`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId",
  "user_id": "ObjectId | null",
  "order_id": "ObjectId | null",
  "name": "string",
  "email": "string",
  "phone": "string | null",
  "subject": "string",
  "message": "string",
  "category": "order | product | payment | refund | general",
  "status": "open | in_progress | resolved | closed",
  "priority": "low | medium | high | urgent",
  "replies": [
    {
      "from": "customer | admin",
      "message": "string",
      "created_at": "datetime"
    }
  ],
  "resolved_at": "datetime | null",
  "created_at": "datetime"
}
```

---

## 12. Shop Settings

### `shop_settings`
```json
{
  "_id": "ObjectId",
  "tenant_id": "ObjectId (1:1)",
  "general": {
    "shop_name": "string",
    "tagline": "string | null",
    "logo_url": "string",
    "favicon_url": "string | null",
    "primary_color": "#hex",
    "secondary_color": "#hex",
    "currency": "INR | USD | EUR",
    "currency_symbol": "₹ | $ | €",
    "timezone": "string",
    "language": "en | hi"
  },
  "contact": {
    "email": "string",
    "phone": "string",
    "whatsapp": "string | null",
    "address": "string | null",
    "social_links": {
      "instagram": "string | null",
      "facebook": "string | null",
      "twitter": "string | null",
      "youtube": "string | null"
    }
  },
  "policies": {
    "return_policy": "string (HTML)",
    "shipping_policy": "string (HTML)",
    "privacy_policy": "string (HTML)",
    "terms": "string (HTML)"
  },
  "features": {
    "reviews_enabled": "boolean",
    "guest_checkout": "boolean",
    "cod_enabled": "boolean",
    "wishlist_enabled": "boolean",
    "vendor_mode": "boolean"
  },
  "seo": {
    "meta_title": "string",
    "meta_description": "string",
    "og_image_url": "string | null"
  },
  "updated_at": "datetime"
}
```
