import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/colors.dart';
import '../providers/cart_notifier.dart';

class PaymentDialog extends ConsumerStatefulWidget {
  final double grandTotal;

  const PaymentDialog({super.key, required this.grandTotal});

  @override
  ConsumerState<PaymentDialog> createState() => _PaymentDialogState();
}

class _PaymentDialogState extends ConsumerState<PaymentDialog> {
  String _selectedMethod = 'CASH';
  late final TextEditingController _amountController;
  final List<Map<String, dynamic>> _appliedPayments = [];

  @override
  void initState() {
    super.initState();
    _amountController = TextEditingController(text: widget.grandTotal.toStringAsFixed(2));
  }

  double get _totalPaid => _appliedPayments.fold(0.0, (sum, p) => sum + (p['amount'] as double));
  double get _remainingBalance => widget.grandTotal - _totalPaid;

  void _addPayment() {
    final amount = double.tryParse(_amountController.text) ?? 0.0;
    if (amount <= 0) return;

    setState(() {
      _appliedPayments.add({
        'method': _selectedMethod,
        'amount': amount > _remainingBalance ? _remainingBalance : amount,
      });
      final remaining = _remainingBalance;
      _amountController.text = remaining > 0 ? remaining.toStringAsFixed(2) : '0.00';
    });
  }

  void _completeSale() {
    // 1. Post to API or queue to local offline database
    // 2. Clear cart
    ref.read(cartProvider.notifier).clearCart();
    Navigator.of(context).pop();

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: AppColors.card,
        content: Row(
          children: [
            Icon(Icons.check_circle, color: AppColors.success, size: 20),
            SizedBox(width: 10),
            Text('Sale completed successfully! Receipt printed.', style: TextStyle(color: AppColors.foreground)),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.card,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
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
                const Text('Payment Settlement', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                IconButton(
                  icon: const Icon(Icons.close, size: 20, color: AppColors.textMuted),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Payable & Remaining Balance
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Total Bill', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                      const SizedBox(height: 2),
                      Text('₹${widget.grandTotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text('Balance Due', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                      const SizedBox(height: 2),
                      Text(
                        '₹${_remainingBalance.clamp(0.0, double.infinity).toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: _remainingBalance <= 0 ? AppColors.success : AppColors.accent,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            // Payment Method Selector
            const Text('Payment Channel', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildMethodChip('CASH', 'Cash', Icons.money),
                _buildMethodChip('UPI', 'UPI QR', Icons.qr_code_2),
                _buildMethodChip('CARD', 'Card Terminal', Icons.credit_card),
                _buildMethodChip('STORE_CREDIT', 'Store Credit', Icons.account_balance_wallet_outlined),
              ],
            ),
            const SizedBox(height: 16),
            // Amount Tendered & Split Addition
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _amountController,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.foreground),
                    decoration: InputDecoration(
                      labelText: 'Amount (₹)',
                      labelStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                      filled: true,
                      fillColor: AppColors.surface,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.surface,
                    foregroundColor: AppColors.foreground,
                    side: const BorderSide(color: AppColors.border),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: _remainingBalance > 0 ? _addPayment : null,
                  child: const Text('Add Tender'),
                ),
              ],
            ),
            // List of Applied Split Payments
            if (_appliedPayments.isNotEmpty) ...[
              const SizedBox(height: 14),
              ..._appliedPayments.map((p) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 2),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('• ${p['method']}', style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
                        Text('₹${(p['amount'] as double).toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                      ],
                    ),
                  )),
            ],
            const SizedBox(height: 24),
            // Finalize Sale Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.onPrimary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: _remainingBalance <= 0 ? _completeSale : null,
                child: const Text('Finalize Invoice & Print Receipt', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMethodChip(String method, String label, IconData icon) {
    final isSelected = _selectedMethod == method;
    return ChoiceChip(
      avatar: Icon(icon, size: 16, color: isSelected ? AppColors.onPrimary : AppColors.textMuted),
      label: Text(label),
      selected: isSelected,
      onSelected: (val) {
        if (val) setState(() => _selectedMethod = method);
      },
      selectedColor: AppColors.primary,
      backgroundColor: AppColors.surface,
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
        color: isSelected ? AppColors.onPrimary : AppColors.foreground,
      ),
      side: BorderSide(color: isSelected ? AppColors.primary : AppColors.border),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    );
  }
}
