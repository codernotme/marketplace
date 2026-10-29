import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/colors.dart';
import '../providers/cart_notifier.dart';
import 'payment_dialog.dart';

class CartView extends ConsumerWidget {
  const CartView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);

    return Container(
      color: AppColors.surface,
      child: Column(
        children: [
          // Cart Header & Customer Selector
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppColors.border)),
            ),
            child: Row(
              children: [
                const Icon(Icons.shopping_bag_outlined, size: 18, color: AppColors.foreground),
                const SizedBox(width: 8),
                Text(
                  'Current Cart (${cart.totalItemCount})',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.foreground),
                ),
                const Spacer(),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.person_add_outlined, size: 16, color: AppColors.accent),
                  label: Text(
                    cart.customerName ?? 'Add Customer',
                    style: const TextStyle(fontSize: 12, color: AppColors.accent),
                  ),
                ),
              ],
            ),
          ),
          // Cart Line Items List
          Expanded(
            child: cart.items.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.shopping_cart_outlined, size: 40, color: AppColors.textMuted),
                        SizedBox(height: 12),
                        Text('Cart is empty', style: TextStyle(fontSize: 14, color: AppColors.textMuted)),
                        SizedBox(height: 4),
                        Text('Tap a product or scan a barcode', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(12),
                    itemCount: cart.items.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final item = cart.items[index];
                      return Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.card,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.product.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${item.variant.sku} · ₹${item.unitPrice.toStringAsFixed(2)}',
                                    style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                                  ),
                                ],
                              ),
                            ),
                            // Quantity Controls
                            Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.remove, size: 16),
                                  color: AppColors.textMuted,
                                  constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
                                  padding: EdgeInsets.zero,
                                  onPressed: () {
                                    ref.read(cartProvider.notifier).updateQuantity(item.variant.id, item.quantity - 1);
                                  },
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppColors.surface,
                                    borderRadius: BorderRadius.circular(4),
                                    border: Border.all(color: AppColors.border),
                                  ),
                                  child: Text(
                                    '${item.quantity}',
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground),
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.add, size: 16),
                                  color: AppColors.textMuted,
                                  constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
                                  padding: EdgeInsets.zero,
                                  onPressed: () {
                                    ref.read(cartProvider.notifier).updateQuantity(item.variant.id, item.quantity + 1);
                                  },
                                ),
                              ],
                            ),
                            const SizedBox(width: 8),
                            // Line Total
                            Text(
                              '₹${item.total.toStringAsFixed(2)}',
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.foreground),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
          // Financial Summary & Checkout Action
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Subtotal', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                    Text('₹${cart.subtotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, color: AppColors.foreground)),
                  ],
                ),
                if (cart.discountAmount > 0) ...[
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Discounts', style: TextStyle(fontSize: 13, color: AppColors.success)),
                      Text('-₹${cart.discountAmount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, color: AppColors.success)),
                    ],
                  ),
                ],
                const SizedBox(height: 8),
                const Divider(height: 1, color: AppColors.border),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Amount', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                    Text(
                      '₹${cart.grandTotal.toStringAsFixed(2)}',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.foreground),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                // Split Payment Action Button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.onPrimary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      elevation: 0,
                    ),
                    onPressed: cart.items.isEmpty
                        ? null
                        : () {
                            showDialog(
                              context: context,
                              builder: (ctx) => PaymentDialog(grandTotal: cart.grandTotal),
                            );
                          },
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.payment, size: 18),
                        SizedBox(width: 8),
                        Text('Proceed to Payment (F4)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
