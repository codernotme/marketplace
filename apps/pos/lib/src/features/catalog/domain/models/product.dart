class Product {
  final String id;
  final String name;
  final String? description;
  final String? categoryName;
  final double basePrice;
  final List<ProductVariant> variants;

  const Product({
    required this.id,
    required this.name,
    this.description,
    this.categoryName,
    required this.basePrice,
    this.variants = const [],
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      categoryName: json['category'] != null ? json['category']['name'] as String? : null,
      basePrice: (json['basePrice'] as num).toDouble(),
      variants: (json['variants'] as List<dynamic>?)
              ?.map((v) => ProductVariant.fromJson(v as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'categoryName': categoryName,
      'basePrice': basePrice,
      'variants': variants.map((v) => v.toJson()).toList(),
    };
  }
}

class ProductVariant {
  final String id;
  final String productId;
  final String sku;
  final String? barcode;
  final Map<String, dynamic> attributeValues;
  final double price;
  final int stockQuantity;

  const ProductVariant({
    required this.id,
    required this.productId,
    required this.sku,
    this.barcode,
    this.attributeValues = const {},
    required this.price,
    this.stockQuantity = 0,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) {
    int totalStock = 0;
    if (json['inventory'] is List) {
      for (final inv in json['inventory']) {
        totalStock += (inv['quantity'] as num?)?.toInt() ?? 0;
      }
    }

    return ProductVariant(
      id: json['id'] as String,
      productId: json['productId'] as String? ?? '',
      sku: json['sku'] as String,
      barcode: json['barcode'] as String?,
      attributeValues: (json['attributeValues'] as Map<String, dynamic>?) ?? {},
      price: (json['price'] as num).toDouble(),
      stockQuantity: totalStock,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productId': productId,
      'sku': sku,
      'barcode': barcode,
      'attributeValues': attributeValues,
      'price': price,
      'stockQuantity': stockQuantity,
    };
  }
}

