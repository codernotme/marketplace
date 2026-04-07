from __future__ import annotations

from datetime import UTC, datetime

from bson import ObjectId


def oid(value: int) -> ObjectId:
    return ObjectId(f"{value:024x}")


def utc(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(UTC)


DEMO_TENANT_ID = oid(1)
DEMO_CUSTOMER_ID = oid(2)
DEMO_SHOP_ADMIN_ID = oid(3)


def tenant_document() -> dict:
    return {
        "_id": DEMO_TENANT_ID,
        "slug": "demo",
        "name": "themrktplace Demo Store",
        "status": "active",
        "db_mode": "shared",
        "created_at": utc("2026-01-01T00:00:00Z"),
        "updated_at": utc("2026-04-07T00:00:00Z"),
    }


def tenant_config_document() -> dict:
    return {
        "tenant_id": DEMO_TENANT_ID,
        "resend_api_key": "",
        "razorpay_key_id": "",
        "razorpay_key_secret": "",
        "telegram_bot_token": "",
        "telegram_chat_id": "",
        "updated_at": utc("2026-04-07T00:00:00Z"),
    }


def demo_user_documents() -> list[dict]:
    return [
        {
            "_id": DEMO_CUSTOMER_ID,
            "tenant_id": DEMO_TENANT_ID,
            "name": "Ava Sterling",
            "email": "ava@example.com",
            "phone": "+1 555 010 7788",
            "password_hash": "$2b$12$demo.demo.demo.demo.demo.demo.demo.demo.demo.demo.demo.demo",
            "role": "customer",
            "is_email_verified": True,
            "is_phone_verified": False,
            "is_active": True,
            "auth_provider": "local",
            "addresses": [],
            "wishlist": ["000000000000000000000004", "000000000000000000000005"],
            "tags": ["vip"],
            "total_orders": 2,
            "total_spent": 540,
            "created_at": utc("2026-02-10T09:00:00Z"),
            "last_login": utc("2026-04-06T09:30:00Z"),
        },
        {
            "_id": DEMO_SHOP_ADMIN_ID,
            "tenant_id": DEMO_TENANT_ID,
            "name": "Store Admin",
            "email": "admin@demo.themrktplace.local",
            "phone": None,
            "password_hash": "$2b$12$demo.demo.demo.demo.demo.demo.demo.demo.demo.demo.demo.demo",
            "role": "shop_admin",
            "is_email_verified": True,
            "is_phone_verified": False,
            "is_active": True,
            "auth_provider": "local",
            "addresses": [],
            "wishlist": [],
            "tags": [],
            "total_orders": 0,
            "total_spent": 0,
            "created_at": utc("2026-02-01T09:00:00Z"),
            "last_login": utc("2026-04-06T09:30:00Z"),
        },
    ]


def category_documents() -> list[dict]:
    return [
        {
            "_id": oid(101),
            "tenant_id": DEMO_TENANT_ID,
            "id": "1",
            "slug": "men",
            "name": "Menswear",
            "icon": "lucide:shirt",
            "image": "https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&w=600&q=80",
            "count": 129,
            "is_active": True,
            "parent_id": None,
            "created_at": utc("2026-02-01T00:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
        },
        {
            "_id": oid(102),
            "tenant_id": DEMO_TENANT_ID,
            "id": "2",
            "slug": "women",
            "name": "Womenswear",
            "icon": "lucide:shopping-bag",
            "image": "https://images.unsplash.com/photo-1519412096601-7b7b85a55553?auto=format&fit=crop&w=600&q=80",
            "count": 98,
            "is_active": True,
            "parent_id": None,
            "created_at": utc("2026-02-01T00:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
        },
        {
            "_id": oid(103),
            "tenant_id": DEMO_TENANT_ID,
            "id": "3",
            "slug": "electronics",
            "name": "Electronics",
            "icon": "lucide:laptop",
            "image": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80",
            "count": 74,
            "is_active": True,
            "parent_id": None,
            "created_at": utc("2026-02-01T00:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
        },
        {
            "_id": oid(104),
            "tenant_id": DEMO_TENANT_ID,
            "id": "4",
            "slug": "home",
            "name": "Home Goods",
            "icon": "lucide:sofa",
            "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
            "count": 56,
            "is_active": True,
            "parent_id": None,
            "created_at": utc("2026-02-01T00:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
        },
        {
            "_id": oid(105),
            "tenant_id": DEMO_TENANT_ID,
            "id": "5",
            "slug": "shoes",
            "name": "Footwear",
            "icon": "lucide:footprints",
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
            "count": 85,
            "is_active": True,
            "parent_id": None,
            "created_at": utc("2026-02-01T00:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
        },
        {
            "_id": oid(106),
            "tenant_id": DEMO_TENANT_ID,
            "id": "6",
            "slug": "accessories",
            "name": "Accessories",
            "icon": "lucide:watch",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
            "count": 63,
            "is_active": True,
            "parent_id": None,
            "created_at": utc("2026-02-01T00:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
        },
    ]


def product_documents() -> list[dict]:
    return [
        {
            "_id": oid(201),
            "tenant_id": DEMO_TENANT_ID,
            "id": "p1",
            "title": "Minimalist Leather Watch",
            "slug": "minimalist-watch",
            "description": (
                "A beautifully crafted minimalist timepiece featuring a genuine Italian "
                "leather strap and Swiss quartz movement. Water resistant up to 50m."
            ),
            "category_id": "6",
            "brand": "Timecraft Co.",
            "price": 189,
            "compare_price": 249,
            "stock": 15,
            "status": "active",
            "flags": {
                "is_new": True,
                "is_trending": True,
                "is_featured": True,
                "is_best_seller": False,
                "is_digital": False,
            },
            "tags": ["watches", "accessories", "leather"],
            "images": [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80",
            ],
            "variants": [
                {"id": "v1a", "name": "Black / Silver", "price": 189, "stock": 10},
                {"id": "v1b", "name": "Brown / Gold", "price": 209, "stock": 5},
            ],
            "ratings_avg": 4.9,
            "ratings_count": 1283,
            "sku": "TIM-MLW-001",
            "created_at": utc("2026-03-01T10:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
            "published_at": utc("2026-03-02T00:00:00Z"),
        },
        {
            "_id": oid(202),
            "tenant_id": DEMO_TENANT_ID,
            "id": "p2",
            "title": "Noise Cancelling Earbuds Pro",
            "slug": "wireless-earbuds",
            "description": (
                "Premium wireless earbuds with industry-leading active noise cancellation."
            ),
            "category_id": "3",
            "brand": "SoundLab",
            "price": 159,
            "compare_price": 219,
            "stock": 24,
            "status": "active",
            "flags": {
                "is_new": False,
                "is_trending": True,
                "is_featured": True,
                "is_best_seller": False,
                "is_digital": False,
            },
            "tags": ["electronics", "audio", "wireless"],
            "images": [
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80"
            ],
            "variants": [
                {"id": "v2a", "name": "Matte White", "price": 159, "stock": 20},
                {"id": "v2b", "name": "Midnight Black", "price": 159, "stock": 18},
            ],
            "ratings_avg": 4.8,
            "ratings_count": 2190,
            "sku": "SND-NCE-001",
            "created_at": utc("2026-03-03T10:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
            "published_at": utc("2026-03-04T00:00:00Z"),
        },
        {
            "_id": oid(203),
            "tenant_id": DEMO_TENANT_ID,
            "id": "p3",
            "title": "Retro Canvas Sneakers",
            "slug": "canvas-sneakers",
            "description": (
                "Inspired by classic 70s court shoes. Vulcanized rubber sole for superior grip."
            ),
            "category_id": "5",
            "brand": "StreetKix",
            "price": 79,
            "compare_price": 99,
            "stock": 15,
            "status": "active",
            "flags": {
                "is_new": False,
                "is_trending": False,
                "is_featured": False,
                "is_best_seller": True,
                "is_digital": False,
            },
            "tags": ["shoes", "sneakers", "retro"],
            "images": [
                "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
            ],
            "variants": [
                {"id": "v3a", "name": "US 8", "price": 79, "stock": 0},
                {"id": "v3b", "name": "US 9", "price": 79, "stock": 15},
                {"id": "v3c", "name": "US 10", "price": 79, "stock": 8},
            ],
            "ratings_avg": 4.3,
            "ratings_count": 892,
            "sku": "SKX-RCS-001",
            "created_at": utc("2026-03-10T10:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
            "published_at": utc("2026-03-11T00:00:00Z"),
        },
        {
            "_id": oid(204),
            "tenant_id": DEMO_TENANT_ID,
            "id": "p4",
            "title": "Handcrafted Ceramic Mug",
            "slug": "ceramic-coffee-mug",
            "description": "Each mug is individually hand-thrown and glazed by local artisans.",
            "category_id": "4",
            "brand": "Terra Studio",
            "price": 34,
            "compare_price": None,
            "stock": 30,
            "status": "active",
            "flags": {
                "is_new": True,
                "is_trending": True,
                "is_featured": False,
                "is_best_seller": False,
                "is_digital": False,
            },
            "tags": ["home", "kitchen", "ceramic"],
            "images": [
                "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80"
            ],
            "variants": [
                {"id": "v4a", "name": "Matte Black", "price": 34, "stock": 30},
                {"id": "v4b", "name": "Speckled White", "price": 34, "stock": 12},
                {"id": "v4c", "name": "Terracotta", "price": 36, "stock": 7},
            ],
            "ratings_avg": 4.9,
            "ratings_count": 674,
            "sku": "TRR-HCM-001",
            "created_at": utc("2026-03-12T10:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
            "published_at": utc("2026-03-13T00:00:00Z"),
        },
        {
            "_id": oid(205),
            "tenant_id": DEMO_TENANT_ID,
            "id": "p5",
            "title": "Artisan Woven Tote Bag",
            "slug": "woven-tote-bag",
            "description": "Hand-woven from natural seagrass by skilled craftspeople.",
            "category_id": "2",
            "brand": "Boho Luxe",
            "price": 89,
            "compare_price": 120,
            "stock": 8,
            "status": "active",
            "flags": {
                "is_new": False,
                "is_trending": True,
                "is_featured": True,
                "is_best_seller": False,
                "is_digital": False,
            },
            "tags": ["bags", "women", "accessories"],
            "images": [
                "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80"
            ],
            "variants": [{"id": "v5a", "name": "Natural Sand", "price": 89, "stock": 8}],
            "ratings_avg": 4.3,
            "ratings_count": 341,
            "sku": "BHL-WTB-001",
            "created_at": utc("2026-03-14T10:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
            "published_at": utc("2026-03-15T00:00:00Z"),
        },
        {
            "_id": oid(206),
            "tenant_id": DEMO_TENANT_ID,
            "id": "p6",
            "title": "65% Mechanical Keyboard",
            "slug": "mechanical-keyboard",
            "description": "The perfect compact keyboard for enthusiasts and developers alike.",
            "category_id": "3",
            "brand": "KeyForge",
            "price": 129,
            "compare_price": 159,
            "stock": 6,
            "status": "draft",
            "flags": {
                "is_new": True,
                "is_trending": False,
                "is_featured": True,
                "is_best_seller": False,
                "is_digital": False,
            },
            "tags": ["electronics", "computers", "gaming"],
            "images": [
                "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80"
            ],
            "variants": [
                {"id": "v6a", "name": "Tactile (Brown)", "price": 129, "stock": 4},
                {"id": "v6b", "name": "Linear (Red)", "price": 129, "stock": 6},
            ],
            "ratings_avg": 4.7,
            "ratings_count": 512,
            "sku": "KFG-MK65-001",
            "created_at": utc("2026-03-18T10:00:00Z"),
            "updated_at": utc("2026-04-07T00:00:00Z"),
            "published_at": None,
        },
    ]


def review_documents() -> list[dict]:
    return [
        {
            "_id": oid(301),
            "tenant_id": DEMO_TENANT_ID,
            "product_id": oid(201),
            "productId": "p1",
            "author": "Alexa Watson",
            "avatar": "https://i.pravatar.cc/100?img=1",
            "rating": 5,
            "date": "2026-03-15",
            "text": "Absolutely love this product! Stylish and comfortable. Highly recommend!",
            "created_at": utc("2026-03-15T09:00:00Z"),
        },
        {
            "_id": oid(302),
            "tenant_id": DEMO_TENANT_ID,
            "product_id": oid(201),
            "productId": "p1",
            "author": "Emily Mendez",
            "avatar": "https://i.pravatar.cc/100?img=5",
            "rating": 5,
            "date": "2026-03-10",
            "text": "Great purchase, the quality exceeded my expectations.",
            "created_at": utc("2026-03-10T09:00:00Z"),
        },
        {
            "_id": oid(303),
            "tenant_id": DEMO_TENANT_ID,
            "product_id": oid(202),
            "productId": "p2",
            "author": "Sarah Kim",
            "avatar": "https://i.pravatar.cc/100?img=9",
            "rating": 5,
            "date": "2026-03-14",
            "text": "Best earbuds I've ever used. The noise cancellation is impressive!",
            "created_at": utc("2026-03-14T09:00:00Z"),
        },
        {
            "_id": oid(304),
            "tenant_id": DEMO_TENANT_ID,
            "product_id": oid(203),
            "productId": "p3",
            "author": "Marcus Lee",
            "avatar": "https://i.pravatar.cc/100?img=7",
            "rating": 4,
            "date": "2026-03-12",
            "text": "Love the classic look. Very comfortable for daily use.",
            "created_at": utc("2026-03-12T09:00:00Z"),
        },
    ]


def blog_post_documents() -> list[dict]:
    return [
        {
            "_id": oid(401),
            "tenant_id": DEMO_TENANT_ID,
            "slug": "top-tech-picks",
            "title": "Top 10 Tech Picks This Season",
            "excerpt": (
                "From wireless earbuds to mechanical keyboards, these are the gadgets "
                "everyone is talking about right now."
            ),
            "category": "Electronics",
            "author": "James Hurst",
            "avatar": "https://i.pravatar.cc/48?img=15",
            "publishedAt": "2026-03-20",
            "readTime": "5 min read",
            "image": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
            "featured": True,
            "content": [
                (
                    "Tech trends shift quickly, but a few categories continue to dominate "
                    "buyer attention."
                ),
                "When comparing devices, focus first on durability and ecosystem compatibility.",
            ],
            "tags": ["electronics", "gadgets"],
            "created_at": utc("2026-03-20T10:00:00Z"),
        },
        {
            "_id": oid(402),
            "tenant_id": DEMO_TENANT_ID,
            "slug": "spring-fashion-trends",
            "title": "Spring Fashion Trends You Need to Know",
            "excerpt": "From earthy tones to bold patterns, this spring fashion is all about personal expression and comfort.",
            "category": "Fashion",
            "author": "Sofia Reyes",
            "avatar": "https://i.pravatar.cc/48?img=5",
            "publishedAt": "2026-03-18",
            "readTime": "4 min read",
            "image": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
            "featured": False,
            "content": [
                "Designers are balancing expressive silhouettes with functional layering.",
                "Muted greens, sand tones, and textured fabrics are shaping the season.",
            ],
            "tags": ["fashion", "spring"],
            "created_at": utc("2026-03-18T10:00:00Z"),
        },
        {
            "_id": oid(403),
            "tenant_id": DEMO_TENANT_ID,
            "slug": "home-decor-guide",
            "title": "The Ultimate Home Decor Guide for 2026",
            "excerpt": "Transform your living space with these curated pieces and interior design ideas from our home category.",
            "category": "Home & Living",
            "author": "Ava Sterling",
            "avatar": "https://i.pravatar.cc/48?img=47",
            "publishedAt": "2026-03-15",
            "readTime": "6 min read",
            "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
            "featured": False,
            "content": [
                "A strong decor update starts with lighting and material contrast.",
                "Neutral bases paired with one high-impact texture can make smaller spaces feel premium.",
            ],
            "tags": ["home", "decor"],
            "created_at": utc("2026-03-15T10:00:00Z"),
        },
        {
            "_id": oid(404),
            "tenant_id": DEMO_TENANT_ID,
            "slug": "sneaker-culture",
            "title": "Sneaker Culture: From Street to Mainstream",
            "excerpt": "How footwear became the defining fashion statement of a generation, and what to buy right now.",
            "category": "Footwear",
            "author": "Marcus Lee",
            "avatar": "https://i.pravatar.cc/48?img=11",
            "publishedAt": "2026-03-12",
            "readTime": "7 min read",
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
            "featured": False,
            "content": [
                "Sneakers now bridge performance design, collectible culture, and everyday wear.",
                "Shoppers are prioritizing comfort stacks and long-term versatility.",
            ],
            "tags": ["footwear", "streetwear"],
            "created_at": utc("2026-03-12T10:00:00Z"),
        },
    ]


def order_documents() -> list[dict]:
    return [
        {
            "_id": oid(501),
            "tenant_id": DEMO_TENANT_ID,
            "id": "ord-1",
            "orderNumber": "MKT-2026-00121",
            "order_number": "MKT-2026-00121",
            "email": "ava@example.com",
            "createdAt": "2026-03-20T14:22:00Z",
            "created_at": utc("2026-03-20T14:22:00Z"),
            "pricing": {
                "subtotal": 348,
                "shippingFee": 0,
                "taxTotal": 28,
                "discountTotal": 20,
                "grandTotal": 356,
            },
            "paymentStatus": "paid",
            "payment_status": "paid",
            "fulfillmentStatus": "delivered",
            "fulfillment_status": "delivered",
            "trackingNumber": "TRK92019088",
            "tracking_number": "TRK92019088",
            "courier": "BlueDart",
            "trackingUrl": "https://example.com/tracking/TRK92019088",
            "shippingAddress": {
                "fullName": "Ava Sterling",
                "phone": "+1 555 010 7788",
                "line1": "123 Main Street",
                "line2": "Apartment 4B",
                "city": "San Francisco",
                "state": "California",
                "pincode": "94103",
                "country": "United States",
            },
            "items": [
                {
                    "id": "ord-1-item-1",
                    "productId": "p1",
                    "title": "Minimalist Leather Watch",
                    "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80",
                    "variantLabel": "Black / Silver",
                    "quantity": 1,
                    "unitPrice": 189,
                    "subtotal": 189,
                }
            ],
            "timeline": [
                {"status": "pending", "note": "Order placed", "createdAt": "2026-03-20T14:22:00Z"},
                {
                    "status": "processing",
                    "note": "Payment confirmed",
                    "createdAt": "2026-03-20T14:25:00Z",
                },
                {"status": "packed", "note": "Items packed", "createdAt": "2026-03-21T08:10:00Z"},
                {
                    "status": "shipped",
                    "note": "Package shipped via BlueDart",
                    "createdAt": "2026-03-21T13:30:00Z",
                },
                {
                    "status": "delivered",
                    "note": "Delivered to front desk",
                    "createdAt": "2026-03-23T17:05:00Z",
                },
            ],
        },
        {
            "_id": oid(502),
            "tenant_id": DEMO_TENANT_ID,
            "id": "ord-2",
            "orderNumber": "MKT-2026-00114",
            "order_number": "MKT-2026-00114",
            "email": "ava@example.com",
            "createdAt": "2026-03-12T11:45:00Z",
            "created_at": utc("2026-03-12T11:45:00Z"),
            "pricing": {
                "subtotal": 159,
                "shippingFee": 12,
                "taxTotal": 13,
                "discountTotal": 0,
                "grandTotal": 184,
            },
            "paymentStatus": "paid",
            "payment_status": "paid",
            "fulfillmentStatus": "shipped",
            "fulfillment_status": "shipped",
            "trackingNumber": "TRK88310117",
            "tracking_number": "TRK88310117",
            "courier": "Delhivery",
            "trackingUrl": "https://example.com/tracking/TRK88310117",
            "shippingAddress": {
                "fullName": "Ava Sterling",
                "phone": "+1 555 010 7788",
                "line1": "580 Market Street",
                "city": "San Francisco",
                "state": "California",
                "pincode": "94104",
                "country": "United States",
            },
            "items": [
                {
                    "id": "ord-2-item-1",
                    "productId": "p2",
                    "title": "Noise Cancelling Earbuds Pro",
                    "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=200&q=80",
                    "variantLabel": "Midnight Black",
                    "quantity": 1,
                    "unitPrice": 159,
                    "subtotal": 159,
                }
            ],
            "timeline": [
                {"status": "pending", "note": "Order placed", "createdAt": "2026-03-12T11:45:00Z"},
                {
                    "status": "processing",
                    "note": "Payment confirmed",
                    "createdAt": "2026-03-12T11:50:00Z",
                },
                {
                    "status": "packed",
                    "note": "Packed and labelled",
                    "createdAt": "2026-03-13T09:20:00Z",
                },
                {
                    "status": "shipped",
                    "note": "Shipped via Delhivery",
                    "createdAt": "2026-03-13T15:00:00Z",
                },
            ],
        },
    ]


def address_documents() -> list[dict]:
    return [
        {
            "_id": oid(601),
            "tenant_id": DEMO_TENANT_ID,
            "id": "addr-1",
            "label": "Home",
            "fullName": "Ava Sterling",
            "phone": "+1 555 010 7788",
            "line1": "123 Main Street",
            "line2": "Apartment 4B",
            "city": "San Francisco",
            "state": "California",
            "pincode": "94103",
            "country": "United States",
            "isDefault": True,
            "user_id": DEMO_CUSTOMER_ID,
        },
        {
            "_id": oid(602),
            "tenant_id": DEMO_TENANT_ID,
            "id": "addr-2",
            "label": "Work",
            "fullName": "Ava Sterling",
            "phone": "+1 555 010 7788",
            "line1": "580 Market Street",
            "city": "San Francisco",
            "state": "California",
            "pincode": "94104",
            "country": "United States",
            "isDefault": False,
            "user_id": DEMO_CUSTOMER_ID,
        },
    ]


def notification_documents() -> list[dict]:
    return [
        {
            "_id": oid(701),
            "tenant_id": DEMO_TENANT_ID,
            "id": "notif-1",
            "channel": "in_app",
            "type": "order_shipped",
            "title": "Order MKT-2026-00114 is on the way",
            "body": "Your package has left our warehouse and is now with Delhivery.",
            "createdAt": "2026-03-13T15:05:00Z",
            "read": False,
            "user_id": DEMO_CUSTOMER_ID,
        },
        {
            "_id": oid(702),
            "tenant_id": DEMO_TENANT_ID,
            "id": "notif-2",
            "channel": "email",
            "type": "promo",
            "title": "Flash sale starts tonight",
            "body": "Get up to 30% off selected footwear and accessories.",
            "createdAt": "2026-03-10T07:30:00Z",
            "read": True,
            "user_id": DEMO_CUSTOMER_ID,
        },
        {
            "_id": oid(703),
            "tenant_id": DEMO_TENANT_ID,
            "id": "notif-3",
            "channel": "push",
            "type": "wishlist_price_drop",
            "title": "A saved item just got cheaper",
            "body": "Retro Canvas Sneakers are now 20% off for a limited time.",
            "createdAt": "2026-03-07T18:10:00Z",
            "read": True,
            "user_id": DEMO_CUSTOMER_ID,
        },
    ]


def storefront_content() -> dict:
    return {
        "home": {
            "hero": {
                "badge": "New Season Arrivals",
                "titleLead": "Shop the",
                "titleHighlight": "Future",
                "titleTail": "of Style.",
                "description": "Curated collections from the world's most innovative brands.",
                "image": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80",
                "primaryCta": {"label": "Shop Now", "href": "/products"},
                "secondaryCta": {"label": "Browse Men", "href": "/category/men"},
                "stats": [
                    {"value": "12K+", "label": "Happy Customers"},
                    {"value": "500+", "label": "Products"},
                ],
            },
            "marqueeItems": [
                "New Arrivals",
                "Free Shipping",
                "Top Brands",
                "Authentic Gear",
                "Exclusive Drops",
                "Best Sellers",
            ],
            "sections": {
                "categories": {
                    "eyebrow": "Browse",
                    "title": "Shop by Category",
                    "action": "See All",
                },
                "trending": {
                    "eyebrow": "Hot Right Now",
                    "title": "Trending Products",
                    "action": "See More",
                },
                "featured": {"eyebrow": "Handpicked", "title": "Featured Collection"},
                "reviews": {"eyebrow": "Reviews", "title": "What Customers Say"},
            },
            "deal": {
                "badge": "Deal of the Day",
                "title": "DR CRZ Varsity Jacket",
                "description": "Limited stock. Up to 25% off premium outerwear.",
                "ctaLabel": "Shop Deal",
                "ctaHref": "/products/varsity-jacket",
                "timerUnits": ["HRS", "MIN", "SEC", "???"],
                "timerValues": ["12", "08", "45", "22"],
                "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
            },
            "testimonials": [
                {
                    "name": "Alexa Watson",
                    "avatar": "https://i.pravatar.cc/100?img=1",
                    "rating": 5,
                    "text": (
                        "Absolutely love this platform! Stylish products and super fast "
                        "delivery."
                    ),
                    "product": "Minimalist Watch",
                },
                {
                    "name": "Emily Mendez",
                    "avatar": "https://i.pravatar.cc/100?img=5",
                    "rating": 5,
                    "text": "The quality exceeded my expectations completely.",
                    "product": "Varsity Jacket",
                },
                {
                    "name": "David Swagner",
                    "avatar": "https://i.pravatar.cc/100?img=11",
                    "rating": 5,
                    "text": "Amazing customer service, genuine products, and beautiful packaging.",
                    "product": "Earbuds Pro",
                },
            ],
            "newsletter": {
                "eyebrow": "Insider Access",
                "title": "Get Exclusive Offers First",
                "description": (
                    "Subscribe to our insider list and get early access to deals, drops "
                    "and new arrivals."
                ),
                "inputPlaceholder": "Enter your email address...",
                "ctaLabel": "Subscribe",
                "footnote": "No spam, ever. Unsubscribe at any time.",
            },
        },
        "blog": {
            "hero": {
                "eyebrow": "The Journal",
                "title": "Stories, Trends & Inspiration",
                "description": "Stay ahead of the curve with the latest in fashion, tech, and lifestyle.",
            },
            "featuredBadge": "Featured",
            "latest": {
                "heading": "Latest Articles",
                "filters": ["All", "Fashion", "Electronics", "Lifestyle", "Home"],
            },
            "newsletter": {
                "title": "Subscribe to The Journal",
                "description": "Get weekly articles, style guides, and exclusive deals in your inbox.",
                "inputPlaceholder": "Enter your email...",
                "ctaLabel": "Subscribe",
            },
            "detail": {
                "backLabel": "Back to blog",
                "relatedHeading": "Related Articles",
                "relatedActionLabel": "View all",
            },
        },
        "contact": {
            "hero": {
                "eyebrow": "Get in Touch",
                "title": "Contact Us",
                "description": "Have a question or need help? We're here to assist you with anything.",
            }
        },
        "about": {
            "hero": {
                "eyebrow": "Our Story",
                "titleLead": "We are",
                "titleHighlight": "themrktplace",
                "description": "Building the world's most curated multi-category marketplace.",
                "image": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80",
            }
        },
        "faq": {
            "hero": {
                "eyebrow": "Help Centre",
                "title": "Frequently Asked Questions",
                "description": "Can't find your answer? Reach out to our support team.",
                "searchPlaceholder": "Search questions...",
            }
        },
        "legal": {
            "privacy": {
                "hero": {
                    "eyebrow": "Legal",
                    "title": "Privacy Policy",
                    "updatedAt": "Last updated: March 21, 2026",
                }
            },
            "refund": {
                "hero": {
                    "eyebrow": "Policies",
                    "title": "Refund Policy",
                    "description": "30-day hassle-free returns. Your satisfaction is our priority.",
                }
            },
            "terms": {
                "hero": {
                    "eyebrow": "Legal",
                    "title": "Terms of Service",
                    "updatedAt": "Last updated: March 21, 2026",
                }
            },
        },
    }


def shop_dashboard_bootstrap() -> dict:

    from services.demo_data import (
        blog_post_documents,
        category_documents,
        order_documents,
        product_documents,
    )

    # Simple hardcoded mock representation of everything to match the UI expectations
    return {
        "kpiData": {
            "todayRevenue": 48250,
            "todayOrders": 23,
            "todayCustomers": 8,
            "totalRevenue": 4820500,
            "totalOrders": 2341,
            "totalProducts": 505,
            "totalCustomers": 1289,
            "pendingOrders": 47,
            "lowStockItems": 4,
            "pendingQueries": 3,
            "telegramBotStatus": "active",
            "weeklyRevenue": [12800, 18200, 14500, 21300, 19600, 25100, 48250],
            "weeklyDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "monthlyRevenue": [
                {"month": "Oct", "revenue": 285000},
                {"month": "Nov", "revenue": 312000},
                {"month": "Dec", "revenue": 498000},
                {"month": "Jan", "revenue": 345000},
                {"month": "Feb", "revenue": 389000},
                {"month": "Mar", "revenue": 421000},
                {"month": "Apr", "revenue": 48250},
            ],
            "revenueThisMonth": 421000,
            "revenueLastMonth": 389000,
        },
        "products": [
            {
                "id": p["id"],
                "slug": p["slug"],
                "title": p["title"],
                "description": p["description"],
                "price": p["price"],
                "comparePrice": p.get("compare_price"),
                "category_id": p["category_id"],
                "brand": p["brand"],
                "images": p["images"],
                "ratings_avg": p["ratings_avg"],
                "ratings_count": p["ratings_count"],
                "is_new": p["flags"].get("is_new"),
                "is_trending": p["flags"].get("is_trending"),
                "is_featured": p["flags"].get("is_featured"),
                "tags": p["tags"],
                "variants": p["variants"],
                "status": p["status"],
                "sku": p["sku"],
            }
            for p in product_documents()
        ],
        "orders": order_documents(),
        "customers": [
            {
                "id": "cust_1",
                "name": "Priya Mehta",
                "email": "priya@example.com",
                "phone": "9876543210",
                "avatar": "https://i.pravatar.cc/100?img=1",
                "totalOrders": 8,
                "totalSpent": 342500,
                "avgOrderValue": 42812,
                "tags": ["vip", "repeat"],
                "joinedAt": "2025-06-15T00:00:00Z",
                "lastOrderAt": "2026-04-06T08:30:00Z",
                "city": "Bengaluru",
                "state": "Karnataka",
                "isActive": True,
            },
            {
                "id": "cust_2",
                "name": "Rahul Gupta",
                "email": "rahul@example.com",
                "phone": "9765432109",
                "avatar": "https://i.pravatar.cc/100?img=11",
                "totalOrders": 5,
                "totalSpent": 185000,
                "avgOrderValue": 37000,
                "tags": ["regular"],
                "joinedAt": "2025-08-20T00:00:00Z",
                "lastOrderAt": "2026-04-06T07:15:00Z",
                "city": "Noida",
                "state": "Uttar Pradesh",
                "isActive": True,
            },
            {
                "id": "cust_3",
                "name": "Ananya Singh",
                "email": "ananya@example.com",
                "phone": "9654321098",
                "avatar": "https://i.pravatar.cc/100?img=5",
                "totalOrders": 3,
                "totalSpent": 498000,
                "avgOrderValue": 166000,
                "tags": ["premium", "vip"],
                "joinedAt": "2025-07-10T00:00:00Z",
                "lastOrderAt": "2026-04-06T06:00:00Z",
                "city": "Chennai",
                "state": "Tamil Nadu",
                "isActive": True,
            },
            {
                "id": "cust_4",
                "name": "Vikram Patel",
                "email": "vikram@example.com",
                "phone": "9543210987",
                "avatar": "https://i.pravatar.cc/100?img=7",
                "totalOrders": 12,
                "totalSpent": 89500,
                "avgOrderValue": 7458,
                "tags": ["budget", "regular"],
                "joinedAt": "2025-04-05T00:00:00Z",
                "lastOrderAt": "2026-04-04T14:00:00Z",
                "city": "Pune",
                "state": "Maharashtra",
                "isActive": True,
            },
            {
                "id": "cust_5",
                "name": "Deepika Joshi",
                "email": "deepika@example.com",
                "phone": "9432109876",
                "avatar": "https://i.pravatar.cc/100?img=9",
                "totalOrders": 2,
                "totalSpent": 28500,
                "avgOrderValue": 14250,
                "tags": ["new"],
                "joinedAt": "2026-03-01T00:00:00Z",
                "lastOrderAt": "2026-04-05T16:00:00Z",
                "city": "Hyderabad",
                "state": "Telangana",
                "isActive": False,
            },
            {
                "id": "cust_6",
                "name": "Arjun Kapoor",
                "email": "arjun@example.com",
                "phone": "9321098765",
                "avatar": "https://i.pravatar.cc/100?img=3",
                "totalOrders": 6,
                "totalSpent": 221000,
                "avgOrderValue": 36833,
                "tags": ["regular", "electronics"],
                "joinedAt": "2025-10-12T00:00:00Z",
                "lastOrderAt": "2026-03-28T10:00:00Z",
                "city": "Mumbai",
                "state": "Maharashtra",
                "isActive": True,
            },
        ],
        "coupons": [
            {
                "id": "coupon_1",
                "code": "WELCOME20",
                "type": "percentage",
                "value": 20,
                "minOrderValue": 500,
                "maxDiscount": 2000,
                "usedCount": 234,
                "usageLimit": 1000,
                "perUserLimit": 1,
                "expiresAt": "2026-12-31T00:00:00Z",
                "isActive": True,
                "applicableTo": "all",
            },
            {
                "id": "coupon_2",
                "code": "SAVE500",
                "type": "fixed",
                "value": 500,
                "minOrderValue": 2000,
                "usedCount": 89,
                "usageLimit": 500,
                "perUserLimit": 2,
                "expiresAt": "2026-06-30T00:00:00Z",
                "isActive": True,
                "applicableTo": "all",
            },
            {
                "id": "coupon_3",
                "code": "FREESHIP",
                "type": "free_shipping",
                "value": 0,
                "minOrderValue": 999,
                "usedCount": 342,
                "usageLimit": 2000,
                "perUserLimit": 5,
                "expiresAt": "2026-05-31T00:00:00Z",
                "isActive": True,
                "applicableTo": "all",
            },
            {
                "id": "coupon_4",
                "code": "TECH15",
                "type": "percentage",
                "value": 15,
                "minOrderValue": 5000,
                "maxDiscount": 5000,
                "usedCount": 45,
                "usageLimit": 200,
                "perUserLimit": 1,
                "expiresAt": "2026-04-30T00:00:00Z",
                "isActive": False,
                "applicableTo": "category",
            },
        ],
        "tickets": [
            {
                "id": "tkt_1",
                "subject": "Order not delivered after 7 days",
                "customer": {"id": "cust_2", "name": "Rahul Gupta", "email": "rahul@example.com"},
                "orderId": "ord_2",
                "status": "open",
                "priority": "high",
                "category": "Delivery",
                "messages": [
                    {
                        "from": "customer",
                        "text": (
                            "My order ORD-2026-4520 was supposed to arrive 3 days ago but "
                            "I haven't received it."
                        ),
                        "at": "2026-04-06T11:00:00Z",
                    }
                ],
                "createdAt": "2026-04-06T11:00:00Z",
                "updatedAt": "2026-04-06T11:00:00Z",
            },
            {
                "id": "tkt_2",
                "subject": "Refund request on cancelled order",
                "customer": {
                    "id": "cust_5",
                    "name": "Deepika Joshi",
                    "email": "deepika@example.com",
                },
                "orderId": "ord_5",
                "status": "in_progress",
                "priority": "medium",
                "category": "Refund",
                "messages": [
                    {
                        "from": "customer",
                        "text": "My order was cancelled but I haven't received refund yet.",
                        "at": "2026-04-05T18:00:00Z",
                    },
                    {
                        "from": "admin",
                        "text": "We have initiated the refund. It will reflect in 5-7 business days.",
                        "at": "2026-04-06T09:00:00Z",
                    },
                ],
                "createdAt": "2026-04-05T18:00:00Z",
                "updatedAt": "2026-04-06T09:00:00Z",
            },
            {
                "id": "tkt_3",
                "subject": "Product quality issue with headphones",
                "customer": {"id": "cust_6", "name": "Arjun Kapoor", "email": "arjun@example.com"},
                "status": "resolved",
                "priority": "low",
                "category": "Product Quality",
                "messages": [
                    {
                        "from": "customer",
                        "text": "The left earcup seems to have lower volume than the right.",
                        "at": "2026-04-02T10:00:00Z",
                    },
                    {
                        "from": "admin",
                        "text": "We are sending a replacement unit. Return label attached.",
                        "at": "2026-04-03T11:00:00Z",
                    },
                ],
                "createdAt": "2026-04-02T10:00:00Z",
                "updatedAt": "2026-04-04T09:00:00Z",
            },
        ],
        "categories": category_documents(),
        "brands": [
            {
                "id": "b1",
                "name": "Nike",
                "slug": "nike",
                "logo": "",
                "isActive": True,
                "productCount": 88,
            },
            {
                "id": "b2",
                "name": "Adidas",
                "slug": "adidas",
                "logo": "",
                "isActive": True,
                "productCount": 74,
            },
            {
                "id": "b3",
                "name": "Apple",
                "slug": "apple",
                "logo": "",
                "isActive": True,
                "productCount": 45,
            },
            {
                "id": "b4",
                "name": "Sony",
                "slug": "sony",
                "logo": "",
                "isActive": True,
                "productCount": 38,
            },
            {
                "id": "b5",
                "name": "Zara",
                "slug": "zara",
                "logo": "",
                "isActive": True,
                "productCount": 52,
            },
            {
                "id": "b6",
                "name": "H&M",
                "slug": "hm",
                "logo": "",
                "isActive": True,
                "productCount": 40,
            },
            {
                "id": "b7",
                "name": "Timecraft Co.",
                "slug": "timecraft",
                "logo": "",
                "isActive": True,
                "productCount": 12,
            },
            {
                "id": "b8",
                "name": "SoundLab",
                "slug": "soundlab",
                "logo": "",
                "isActive": True,
                "productCount": 8,
            },
            {
                "id": "b9",
                "name": "StreetKix",
                "slug": "streetkix",
                "logo": "",
                "isActive": True,
                "productCount": 15,
            },
            {
                "id": "b10",
                "name": "KeyForge",
                "slug": "keyforge",
                "logo": "",
                "isActive": True,
                "productCount": 6,
            },
            {
                "id": "b11",
                "name": "DR CRZ Studio",
                "slug": "drcrz",
                "logo": "",
                "isActive": True,
                "productCount": 9,
            },
            {
                "id": "b12",
                "name": "FlexForm",
                "slug": "flexform",
                "logo": "",
                "isActive": True,
                "productCount": 18,
            },
        ],
        "banners": [
            {
                "id": "ban_1",
                "title": "New Season Arrivals",
                "placement": "Hero Slider",
                "link": "/new-arrivals",
                "isActive": True,
                "startsAt": "2026-04-01T00:00:00Z",
                "endsAt": "2026-04-30T00:00:00Z",
                "clicks": 1243,
                "impressions": 45200,
            },
            {
                "id": "ban_2",
                "title": "DR CRZ Varsity Deal",
                "placement": "Mid-Banner",
                "link": "/products/varsity-jacket",
                "isActive": True,
                "startsAt": "2026-04-01T00:00:00Z",
                "endsAt": "2026-04-30T00:00:00Z",
                "clicks": 876,
                "impressions": 32100,
            },
            {
                "id": "ban_3",
                "title": "Electronics Popup Sale",
                "placement": "Popup",
                "link": "/category/electronics",
                "isActive": False,
                "startsAt": "2026-05-01T00:00:00Z",
                "endsAt": "2026-05-15T00:00:00Z",
                "clicks": 0,
                "impressions": 0,
            },
        ],
        "pages": [
            {
                "id": "pg_1",
                "slug": "about-us",
                "title": "About Us",
                "status": "active",
                "content": "We are an innovative store curated for the future...",
                "seoDescription": "Learn more about the mission and values of themrktplace.",
                "updatedAt": "2026-04-06T10:00:00Z",
            },
            {
                "id": "pg_2",
                "slug": "privacy-policy",
                "title": "Privacy Policy",
                "status": "active",
                "content": "Your data is safe with us. We use industry-standard encryption...",
                "seoDescription": "Read our commitment to your privacy and data security.",
                "updatedAt": "2026-03-15T09:00:00Z",
            },
            {
                "id": "pg_3",
                "slug": "terms-of-service",
                "title": "Terms of Service",
                "status": "active",
                "content": "By using our platform, you agree to the following terms...",
                "seoDescription": (
                    "Official terms and conditions for using the themrktplace platform."
                ),
                "updatedAt": "2026-03-10T12:00:00Z",
            },
            {
                "id": "pg_4",
                "slug": "shipping-returns",
                "title": "Shipping & Returns",
                "status": "draft",
                "content": "Detailed info on shipping times and our 30-day return policy...",
                "seoDescription": "Hassle-free shipping and returns policy details.",
                "updatedAt": "2026-04-06T11:00:00Z",
            },
        ],
        "blogPosts": blog_post_documents(),
        "recentActivity": [
            {
                "id": 1,
                "type": "order",
                "message": "New order #ORD-2026-4521 from Priya Mehta",
                "time": "5 mins ago",
                "icon": "solar:cart-large-bold-duotone",
            },
            {
                "id": 2,
                "type": "customer",
                "message": "New customer registration: Deepika Joshi",
                "time": "1 hr ago",
                "icon": "solar:user-plus-bold-duotone",
            },
            {
                "id": 3,
                "type": "product",
                "message": "Low stock alert: Retro Canvas Sneakers (US 8 — 0 left)",
                "time": "2 hrs ago",
                "icon": "solar:box-bold-duotone",
            },
            {
                "id": 4,
                "type": "ticket",
                "message": "New support ticket from Rahul Gupta",
                "time": "3 hrs ago",
                "icon": "solar:chat-round-bold-duotone",
            },
            {
                "id": 5,
                "type": "order",
                "message": "Order #ORD-2026-4520 updated to Processing",
                "time": "4 hrs ago",
                "icon": "solar:refresh-bold-duotone",
            },
        ],
        "teamMembers": [
            {
                "id": "team_1",
                "name": "Aryan Bajpai",
                "email": "aryan@themrktplace.com",
                "role": "admin",
                "avatar": "https://i.pravatar.cc/100?img=68",
                "isActive": True,
            },
            {
                "id": "team_2",
                "name": "Neha Verma",
                "email": "neha@themrktplace.com",
                "role": "manager",
                "avatar": "https://i.pravatar.cc/100?img=47",
                "isActive": True,
            },
            {
                "id": "team_3",
                "name": "Rohan Das",
                "email": "rohan@themrktplace.com",
                "role": "support",
                "avatar": "https://i.pravatar.cc/100?img=52",
                "isActive": True,
            },
            {
                "id": "team_4",
                "name": "Meera Iyer",
                "email": "meera@themrktplace.com",
                "role": "viewer",
                "avatar": "https://i.pravatar.cc/100?img=42",
                "isActive": False,
            },
        ],
        "emailTemplates": [
            {
                "id": "et_1",
                "name": "Order Confirmed",
                "subject": "Your order #{{order_number}} is confirmed! 🎉",
                "isActive": True,
            },
            {
                "id": "et_2",
                "name": "Order Shipped",
                "subject": "Your order #{{order_number}} is on its way! 🚚",
                "isActive": True,
            },
            {
                "id": "et_3",
                "name": "Order Delivered",
                "subject": "Your order #{{order_number}} has been delivered! ✅",
                "isActive": True,
            },
            {
                "id": "et_4",
                "name": "Order Cancelled",
                "subject": "Order #{{order_number}} has been cancelled.",
                "isActive": True,
            },
            {
                "id": "et_5",
                "name": "Refund Initiated",
                "subject": "Refund processed for order #{{order_number}}",
                "isActive": True,
            },
            {
                "id": "et_6",
                "name": "Welcome Email",
                "subject": "Welcome to themrktplace! 👋",
                "isActive": True,
            },
            {
                "id": "et_7",
                "name": "Password Reset",
                "subject": "Reset your password — themrktplace",
                "isActive": True,
            },
        ],
        "analyticsData": {
            "salesOverview": [
                {"month": "Oct", "revenue": 285000},
                {"month": "Nov", "revenue": 312000},
                {"month": "Dec", "revenue": 498000},
                {"month": "Jan", "revenue": 345000},
                {"month": "Feb", "revenue": 389000},
                {"month": "Mar", "revenue": 421000},
                {"month": "Apr", "revenue": 48250},
            ],
            "topProducts": [
                {"title": "Nike Tech Hera Runners", "revenue": 8468800, "units": 501},
                {"title": "Noise Cancelling Earbuds Pro", "revenue": 6120000, "units": 384},
                {"title": "DR CRZ Varsity Jacket", "revenue": 5623000, "units": 161},
                {"title": "Minimalist Leather Watch", "revenue": 4899000, "units": 260},
                {"title": "High-Rise Sculpt Yoga Pants", "revenue": 3622000, "units": 525},
            ],
            "newVsReturning": [
                {"name": "New Customers", "value": 342},
                {"name": "Returning Customers", "value": 947},
            ],
            "conversionFunnel": [
                {"stage": "Visited", "count": 45200},
                {"stage": "Added to Cart", "count": 12800},
                {"stage": "Checkout", "count": 4200},
                {"stage": "Paid", "count": 2341},
            ],
        },
    }


async def ensure_demo_data(master_db, shared_db) -> None:
    tenants = master_db["tenants"]
    if await tenants.count_documents({"slug": "demo"}) == 0:
        await tenants.insert_one(tenant_document())

    tenant_configs = master_db["tenant_configs"]
    if await tenant_configs.count_documents({"tenant_id": DEMO_TENANT_ID}) == 0:
        await tenant_configs.insert_one(tenant_config_document())

    users = shared_db["users"]
    if await users.count_documents({"tenant_id": DEMO_TENANT_ID}) == 0:
        await users.insert_many(demo_user_documents())

    collections = {
        "categories": category_documents(),
        "products": product_documents(),
        "reviews": review_documents(),
        "orders": order_documents(),
        "addresses": address_documents(),
        "notifications": notification_documents(),
        "blog_posts": blog_post_documents(),
    }
    for name, documents in collections.items():
        collection = shared_db[name]
        if await collection.count_documents({"tenant_id": DEMO_TENANT_ID}) == 0:
            await collection.insert_many(documents)
