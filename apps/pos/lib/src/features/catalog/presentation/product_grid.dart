import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/colors.dart';
import '../../../core/network/api_client.dart';
import '../domain/models/product.dart';
import '../../cart/providers/cart_notifier.dart';

class ProductGrid extends ConsumerStatefulWidget {
  const ProductGrid({super.key});

  @override
  ConsumerState<ProductGrid> createState() => _ProductGridState();
}

class _ProductGridState extends ConsumerState<ProductGrid> {
  final TextEditingController _searchController = TextEditingController();
  List<Product> _products = [];
  bool _isLoading = false;

  final List<Product> _sampleProducts = [
    const Product(
      id: 'prod_1',
      name: 'Oxford Cotton Shirt',
      categoryName: 'Tops & Shirts',
      basePrice: 1899.00,
      variants: [
        ProductVariant(
          id: 'var_1',
          productId: 'prod_1',
          sku: 'SHT-OXF-WHT-M',
          barcode: '890123456001',
          attributeValues: {'Size': 'M', 'Color': 'White'},
          price: 1899.00,
          stockQuantity: 24,
        ),
      ],
    ),
    const Product(
      id: 'prod_2',
      name: 'Slim Fit Chino Trouser',
      categoryName: 'Trousers & Pants',
      basePrice: 2499.00,
      variants: [
        ProductVariant(
          id: 'var_2',
          productId: 'prod_2',
          sku: 'PNT-CHN-KHK-32',
          barcode: '890123456002',
          attributeValues: {'Size': '32', 'Color': 'Khaki'},
          price: 2499.00,
          stockQuantity: 15,
        ),
      ],
    ),
    const Product(
      id: 'prod_3',
      name: 'Linen Summer Blazer',
      categoryName: 'Outerwear',
      basePrice: 4999.00,
      variants: [
        ProductVariant(
          id: 'var_3',
          productId: 'prod_3',
          sku: 'BLZ-LIN-BEI-40',
          barcode: '890123456003',
          attributeValues: {'Size': '40', 'Color': 'Beige'},
          price: 4999.00,
          stockQuantity: 8,
        ),
      ],
    ),
    const Product(
      id: 'prod_4',
      name: 'Ribbed Knit Midi Dress',
      categoryName: 'Dresses',
      basePrice: 3299.00,
      variants: [
        ProductVariant(
          id: 'var_4',
          productId: 'prod_4',
          sku: 'DRS-KNT-BLK-S',
          barcode: '890123456004',
          attributeValues: {'Size': 'S', 'Color': 'Black'},
          price: 3299.00,
          stockQuantity: 12,
        ),
      ],
    ),
    const Product(
      id: 'prod_5',
      name: 'Pure Silk Jacquard Tie',
      categoryName: 'Accessories',
      basePrice: 1299.00,
      variants: [
        ProductVariant(
          id: 'var_5',
          productId: 'prod_5',
          sku: 'ACC-TIE-MAR-OS',
          barcode: '890123456005',
          attributeValues: {'Color': 'Maroon'},
          price: 1299.00,
          stockQuantity: 30,
        ),
      ],
    ),
  ];

  @override
  void initState() {
    super.initState();
    _products = List.from(_sampleProducts);
    _searchController.addListener(() => setState(() {}));
    _fetchLiveProducts();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchLiveProducts() async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiClient().dio.get('/products');
      if (res.statusCode == 200 && res.data != null) {
        final List<dynamic> list = res.data['data'] is List
            ? res.data['data']
            : (res.data is List ? res.data : []);
        if (list.isNotEmpty && mounted) {
          final liveProducts = list
              .map((p) => Product.fromJson(p as Map<String, dynamic>))
              .where((p) => p.variants.isNotEmpty)
              .toList();
          if (liveProducts.isNotEmpty) {
            setState(() {
              _products = liveProducts;
            });
          }
        }
      }
    } catch (_) {
      // Offline fallback: retains sample products
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  List<Product> get _filteredProducts {
    final query = _searchController.text.trim().toLowerCase();
    if (query.isEmpty) return _products;
    return _products.where((p) {
      final nameMatches = p.name.toLowerCase().contains(query);
      final catMatches = p.categoryName?.toLowerCase().contains(query) ?? false;
      final skuMatches = p.variants.any((v) =>
          v.sku.toLowerCase().contains(query) ||
          (v.barcode != null && v.barcode!.toLowerCase().contains(query)));
      return nameMatches || catMatches || skuMatches;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final displayProducts = _filteredProducts;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                  style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                  decoration: InputDecoration(
                    hintText: 'Search products by name, SKU, or scan barcode (F2)...',
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                    prefixIcon: const Icon(Icons.search, size: 20, color: AppColors.textMuted),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 18, color: AppColors.textMuted),
                            onPressed: () => _searchController.clear(),
                          )
                        : const Icon(Icons.qr_code_scanner, size: 20, color: AppColors.accent),
                    filled: true,
                    fillColor: AppColors.surface,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.primary),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: _isLoading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                      )
                    : const Icon(Icons.refresh, size: 20, color: AppColors.textMuted),
                tooltip: 'Sync catalog from server',
                onPressed: _isLoading ? null : _fetchLiveProducts,
              ),
            ],
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: displayProducts.isEmpty
                ? const Center(
                    child: Text(
                      'No products match your search.',
                      style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                    ),
                  )
                : GridView.builder(
                    itemCount: displayProducts.length,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      childAspectRatio: 1.15,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                    ),
                    itemBuilder: (context, index) {
                      final product = displayProducts[index];
                      final primaryVariant = product.variants.first;

                      return InkWell(
                        onTap: () {
                          ref.read(cartProvider.notifier).addItem(product, primaryVariant);
                        },
                        borderRadius: BorderRadius.circular(10),
                        child: Container(
                          decoration: BoxDecoration(
                            color: AppColors.card,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.border),
                          ),
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    product.categoryName ?? 'Apparel',
                                    style: const TextStyle(
                                      fontSize: 11,
                                      color: AppColors.textMuted,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: primaryVariant.stockQuantity > 5
                                          ? AppColors.success.withOpacity(0.12)
                                          : AppColors.warning.withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      '${primaryVariant.stockQuantity} in stock',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: primaryVariant.stockQuantity > 5
                                            ? AppColors.success
                                            : AppColors.warning,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const Spacer(),
                              Text(
                                product.name,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.foreground,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                primaryVariant.sku,
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontFamily: 'monospace',
                                  color: AppColors.textMuted,
                                ),
                              ),
                              const Spacer(),
                              Text(
                                '₹${primaryVariant.price.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.foreground,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ),
      ],
    );
  }
}
