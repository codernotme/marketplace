import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class CustomerCrmView extends StatefulWidget {
  const CustomerCrmView({super.key});

  @override
  State<CustomerCrmView> createState() => _CustomerCrmViewState();
}

class _CustomerCrmViewState extends State<CustomerCrmView> {
  final List<Map<String, dynamic>> _customers = [
    {
      'name': 'Neha Sharma',
      'phone': '+91 98765 43210',
      'email': 'neha.sharma@gmail.com',
      'totalOrders': 8,
      'totalSpend': 34250.00,
      'loyaltyPoints': 342,
      'storeCredit': 1500.00,
    },
    {
      'name': 'Rohan Nair',
      'phone': '+91 98111 22334',
      'email': 'rohan.nair@outlook.com',
      'totalOrders': 4,
      'totalSpend': 18900.00,
      'loyaltyPoints': 189,
      'storeCredit': 0.00,
    },
    {
      'name': 'Priya Patel',
      'phone': '+91 99887 76655',
      'email': 'priya.patel@yahoo.com',
      'totalOrders': 12,
      'totalSpend': 58400.00,
      'loyaltyPoints': 584,
      'storeCredit': 2250.00,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Customer Relationship & Loyalty Management', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground)),
          const SizedBox(height: 4),
          const Text('View customer purchase history, loyalty rewards, and store credit balances', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
          const SizedBox(height: 20),
          Expanded(
            child: Container(
              decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.border)),
              child: ListView.separated(
                itemCount: _customers.length,
                separatorBuilder: (_, __) => const Divider(color: AppColors.border, height: 1),
                itemBuilder: (context, index) {
                  final c = _customers[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: AppColors.surface,
                          child: Text(
                            (c['name'] as String).substring(0, 1),
                            style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.accent),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          flex: 3,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(c['name'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                              const SizedBox(height: 2),
                              Text('${c['phone']} · ${c['email']}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                        Expanded(
                          flex: 2,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${c['totalOrders']} orders', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                              Text('₹${(c['totalSpend'] as double).toStringAsFixed(0)} spent', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: AppColors.accentSubtle, borderRadius: BorderRadius.circular(4)),
                          child: Text('${c['loyaltyPoints']} pts', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.accent)),
                        ),
                        const SizedBox(width: 14),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: AppColors.successSubtle, borderRadius: BorderRadius.circular(4)),
                          child: Text('₹${(c['storeCredit'] as double).toStringAsFixed(0)} credit', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.success)),
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

