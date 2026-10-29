import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class InventoryManagementView extends StatefulWidget {
  const InventoryManagementView({super.key});

  @override
  State<InventoryManagementView> createState() => _InventoryManagementViewState();
}

class _InventoryManagementViewState extends State<InventoryManagementView> {
  final List<Map<String, dynamic>> _inventory = [
    {'name': 'Oxford Cotton Shirt', 'variant': 'White / M', 'sku': 'SHT-OXF-WHT-M', 'quantity': 24, 'alert': 5},
    {'name': 'Slim Fit Chino Trouser', 'variant': 'Khaki / 32', 'sku': 'PNT-CHN-KHK-32', 'quantity': 15, 'alert': 5},
    {'name': 'Linen Summer Blazer', 'variant': 'Beige / 40', 'sku': 'BLZ-LIN-BEI-40', 'quantity': 8, 'alert': 5},
    {'name': 'Ribbed Knit Midi Dress', 'variant': 'Black / S', 'sku': 'DRS-KNT-BLK-S', 'quantity': 12, 'alert': 5},
    {'name': 'Pure Silk Jacquard Tie', 'variant': 'Maroon / OS', 'sku': 'ACC-TIE-MAR-OS', 'quantity': 3, 'alert': 5},
  ];

  void _showAdjustStockDialog(Map<String, dynamic> item) {
    int adjustment = 0;
    String reason = 'DAMAGE';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => Dialog(
          backgroundColor: AppColors.surface,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14), side: const BorderSide(color: AppColors.border)),
          child: Container(
            width: 440,
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Adjust Stock: ${item['name']}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                const SizedBox(height: 4),
                Text('${item['variant']} · Current quantity: ${item['quantity']}', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: reason,
                  dropdownColor: AppColors.card,
                  decoration: const InputDecoration(labelText: 'Adjustment Reason'),
                  items: const [
                    DropdownMenuItem(value: 'DAMAGE', child: Text('Damaged / Defective Garment')),
                    DropdownMenuItem(value: 'RECOUNT', child: Text('Physical Stock Audit Variance')),
                    DropdownMenuItem(value: 'RETURN', child: Text('Supplier Return / Exchange')),
                    DropdownMenuItem(value: 'STORE_USE', child: Text('Mannequin / Display Store Use')),
                  ],
                  onChanged: (val) {
                    if (val != null) setDialogState(() => reason = val);
                  },
                ),
                const SizedBox(height: 14),
                TextFormField(
                  keyboardType: const TextInputType.numberWithOptions(signed: true),
                  decoration: const InputDecoration(labelText: 'Quantity Change (+ or -)', hintText: 'e.g. -1 or +5'),
                  style: const TextStyle(color: AppColors.foreground),
                  onChanged: (val) {
                    adjustment = int.tryParse(val) ?? 0;
                  },
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    OutlinedButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Cancel')),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: AppColors.onPrimary),
                      onPressed: () {
                        setState(() {
                          item['quantity'] = (item['quantity'] as int) + adjustment;
                        });
                        Navigator.of(ctx).pop();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Stock updated for ${item['name']}')),
                        );
                      },
                      child: const Text('Confirm Adjustment'),
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
          const Text('Inventory Levels & Physical Stock Management', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground)),
          const SizedBox(height: 4),
          const Text('Real-time physical stock counts across all apparel variants', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
          const SizedBox(height: 20),
          Expanded(
            child: Container(
              decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.border)),
              child: ListView.separated(
                itemCount: _inventory.length,
                separatorBuilder: (_, __) => const Divider(color: AppColors.border, height: 1),
                itemBuilder: (context, index) {
                  final item = _inventory[index];
                  final qty = item['quantity'] as int;
                  final alert = item['alert'] as int;
                  final isLow = qty <= alert;

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                    child: Row(
                      children: [
                        Icon(isLow ? Icons.warning_amber_rounded : Icons.check_circle_outline, color: isLow ? AppColors.danger : AppColors.success, size: 22),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item['name'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                              const SizedBox(height: 2),
                              Text('${item['variant']} · ${item['sku']}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: isLow ? AppColors.dangerSubtle : AppColors.successSubtle,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            '$qty units',
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: isLow ? AppColors.danger : AppColors.success),
                          ),
                        ),
                        const SizedBox(width: 16),
                        OutlinedButton(
                          style: OutlinedButton.styleFrom(foregroundColor: AppColors.foreground, side: const BorderSide(color: AppColors.border)),
                          onPressed: () => _showAdjustStockDialog(item),
                          child: const Text('Adjust', style: TextStyle(fontSize: 12)),
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

