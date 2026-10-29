import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class ReportsView extends StatelessWidget {
  const ReportsView({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
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
                  Text('Financial Reports & GST Ledger', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                  SizedBox(height: 4),
                  Text('End of Day (EOD) register closing, tender breakdown, and GSTR-1 summaries', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.onPrimary,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('GSTR-1 CSV exported successfully to downloads folder')),
                  );
                },
                icon: const Icon(Icons.download, size: 16),
                label: const Text('Export GSTR-1 CSV', style: TextStyle(fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // EOD Summary Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Today\'s Financial Breakdown', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                    Text('Date: 28 October 2026', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildItem('Gross Sales (Total)', '₹64,280.00', isBold: true)),
                    Expanded(child: _buildItem('Net Taxable Value', '₹54,474.58')),
                    Expanded(child: _buildItem('Output GST (18%)', '₹9,805.42')),
                    Expanded(child: _buildItem('Total Invoices', '45 orders')),
                  ],
                ),
                const Divider(color: AppColors.border, height: 28),
                const Text('Sales by Payment Channel:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildPaymentPill('Cash Register', '₹18,450.00', Icons.money)),
                    const SizedBox(width: 10),
                    Expanded(child: _buildPaymentPill('UPI QR Code', '₹28,630.00', Icons.qr_code_2)),
                    const SizedBox(width: 10),
                    Expanded(child: _buildPaymentPill('Card Swipe', '₹14,200.00', Icons.credit_card)),
                    const SizedBox(width: 10),
                    Expanded(child: _buildPaymentPill('Store Credit / Web', '₹3,000.00', Icons.account_balance_wallet_outlined)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItem(String label, String value, {bool isBold = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: isBold ? 18 : 15, fontWeight: isBold ? FontWeight.w800 : FontWeight.w600, color: AppColors.foreground)),
      ],
    );
  }

  Widget _buildPaymentPill(String method, String amount, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.accent),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(method, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              Text(amount, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.foreground)),
            ],
          ),
        ],
      ),
    );
  }
}

