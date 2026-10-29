import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class ProductsManagementView extends StatefulWidget {
  const ProductsManagementView({super.key});

  @override
  State<ProductsManagementView> createState() => _ProductsManagementViewState();
}

class _ProductsManagementViewState extends State<ProductsManagementView> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _products = [
    {
      'id': 'p1',
      'name': 'Oxford Cotton Shirt',
      'category': 'Tops & Shirts',
      'sku': 'SHT-OXF-WHT-M',
      'price': 1899.00,
      'costPrice': 850.00,
      'stock': 24,
      'liveOnWebsite': true,
    },
    {
      'id': 'p2',
      'name': 'Slim Fit Chino Trouser',
      'category': 'Trousers & Pants',
      'sku': 'PNT-CHN-KHK-32',
      'price': 2499.00,
      'costPrice': 1100.00,
      'stock': 15,
      'liveOnWebsite': true,
    },
    {
      'id': 'p3',
      'name': 'Linen Summer Blazer',
      'category': 'Outerwear',
      'sku': 'BLZ-LIN-BEI-40',
      'price': 4999.00,
      'costPrice': 2200.00,
      'stock': 8,
      'liveOnWebsite': true,
    },
    {
      'id': 'p4',
      'name': 'Ribbed Knit Midi Dress',
      'category': 'Dresses',
      'sku': 'DRS-KNT-BLK-S',
      'price': 3299.00,
      'costPrice': 1400.00,
      'stock': 12,
      'liveOnWebsite': true,
    },
    {
      'id': 'p5',
      'name': 'Pure Silk Jacquard Tie',
      'category': 'Accessories',
      'sku': 'ACC-TIE-MAR-OS',
      'price': 1299.00,
      'costPrice': 450.00,
      'stock': 3,
      'liveOnWebsite': false,
    },
  ];

  void _showAddProductDialog() {
    final nameCtrl = TextEditingController();
    final skuCtrl = TextEditingController();
    final priceCtrl = TextEditingController();
    final costCtrl = TextEditingController();
    final stockCtrl = TextEditingController(text: '10');
    bool liveOnWebsite = true;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => Dialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
            side: const BorderSide(color: AppColors.border),
          ),
          child: Container(
            width: 520,
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Add New Apparel Product', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                    IconButton(icon: const Icon(Icons.close, size: 20, color: AppColors.textMuted), onPressed: () => Navigator.of(ctx).pop()),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: nameCtrl,
                  style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                  decoration: const InputDecoration(labelText: 'Product Name', hintText: 'e.g. Classic Linen Shirt'),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: skuCtrl,
                        style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                        decoration: const InputDecoration(labelText: 'SKU / Barcode', hintText: 'e.g. SHT-LIN-001'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: stockCtrl,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                        decoration: const InputDecoration(labelText: 'Opening Stock', hintText: '10'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: priceCtrl,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                        decoration: const InputDecoration(labelText: 'Selling Price (₹)', hintText: '1999.00'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: costCtrl,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                        decoration: const InputDecoration(labelText: 'Cost Price (₹)', hintText: '850.00'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Show on D2C Website', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                  subtitle: const Text('Instantly make available for customer ordering online', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                  value: liveOnWebsite,
                  activeColor: AppColors.accent,
                  onChanged: (val) {
                    setDialogState(() => liveOnWebsite = val);
                  },
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(foregroundColor: AppColors.textMuted),
                      onPressed: () => Navigator.of(ctx).pop(),
                      child: const Text('Cancel'),
                    ),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: AppColors.onPrimary),
                      onPressed: () {
                        if (nameCtrl.text.isNotEmpty && priceCtrl.text.isNotEmpty) {
                          setState(() {
                            _products.insert(0, {
                              'id': 'p_${DateTime.now().millisecondsSinceEpoch}',
                              'name': nameCtrl.text,
                              'category': 'Apparel',
                              'sku': skuCtrl.text.isEmpty ? 'SKU-${DateTime.now().millisecond}' : skuCtrl.text,
                              'price': double.tryParse(priceCtrl.text) ?? 0.0,
                              'costPrice': double.tryParse(costCtrl.text) ?? 0.0,
                              'stock': int.tryParse(stockCtrl.text) ?? 0,
                              'liveOnWebsite': liveOnWebsite,
                            });
                          });
                          Navigator.of(ctx).pop();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Product created and catalog updated!')),
                          );
                        }
                      },
                      child: const Text('Save & Publish Product'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Apparel Catalog & Product Management', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                  SizedBox(height: 4),
                  Text('Manage products, pricing, stock levels, and website visibility', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.onPrimary,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                onPressed: _showAddProductDialog,
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Add Product', style: TextStyle(fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Search & Filter Bar
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                  style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                  decoration: InputDecoration(
                    hintText: 'Search products by name, SKU, or category...',
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                    prefixIcon: const Icon(Icons.search, size: 18, color: AppColors.textMuted),
                    filled: true,
                    fillColor: AppColors.card,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.foreground,
                  side: const BorderSide(color: AppColors.border),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                ),
                onPressed: () {},
                icon: const Icon(Icons.filter_list, size: 16),
                label: const Text('Filter Category', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 18),
          // Products Data Table
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: ListView.separated(
                itemCount: _products.length,
                separatorBuilder: (_, __) => const Divider(color: AppColors.border, height: 1),
                itemBuilder: (context, index) {
                  final p = _products[index];
                  final isLive = p['liveOnWebsite'] as bool;
                  final stock = p['stock'] as int;

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: const Icon(Icons.checkroom, color: AppColors.accent, size: 20),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          flex: 3,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(p['name'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                              const SizedBox(height: 2),
                              Text('${p['category']} · ${p['sku']}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                        Expanded(
                          flex: 2,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('₹${(p['price'] as double).toStringAsFixed(2)}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                              Text('Cost: ₹${(p['costPrice'] as double).toStringAsFixed(2)}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: stock > 5 ? AppColors.successSubtle : AppColors.dangerSubtle,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            '$stock in stock',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: stock > 5 ? AppColors.success : AppColors.danger),
                          ),
                        ),
                        const SizedBox(width: 20),
                        // Website Live Badge
                        InkWell(
                          onTap: () {
                            setState(() {
                              p['liveOnWebsite'] = !isLive;
                            });
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: isLive ? AppColors.accentSubtle : AppColors.surface,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: isLive ? AppColors.accent : AppColors.border),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.public, size: 12, color: isLive ? AppColors.accent : AppColors.textMuted),
                                const SizedBox(width: 4),
                                Text(
                                  isLive ? 'Live on Web' : 'POS Only',
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: isLive ? AppColors.accent : AppColors.textMuted),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        IconButton(
                          icon: const Icon(Icons.edit_outlined, size: 18, color: AppColors.textMuted),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

