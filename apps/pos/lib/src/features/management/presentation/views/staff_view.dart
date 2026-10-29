import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class StaffView extends StatefulWidget {
  const StaffView({super.key});

  @override
  State<StaffView> createState() => _StaffViewState();
}

class _StaffViewState extends State<StaffView> {
  final List<Map<String, dynamic>> _staff = [
    {'name': 'Aryan Verma', 'role': 'OWNER', 'code': 'EMP-001', 'hasPin': true, 'active': true},
    {'name': 'Kavita Sundaram', 'role': 'MANAGER', 'code': 'EMP-002', 'hasPin': true, 'active': true},
    {'name': 'Vikram Seth', 'role': 'CASHIER', 'code': 'EMP-003', 'hasPin': true, 'active': true},
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Staff Members & Cashier PINs', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground)),
          const SizedBox(height: 4),
          const Text('Configure store staff, assign roles, and set register terminal lock PINs', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
          const SizedBox(height: 20),
          Expanded(
            child: Container(
              decoration: BoxDecoration(color: AppColors.card, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.border)),
              child: ListView.separated(
                itemCount: _staff.length,
                separatorBuilder: (_, __) => const Divider(color: AppColors.border, height: 1),
                itemBuilder: (context, index) {
                  final s = _staff[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                    child: Row(
                      children: [
                        const Icon(Icons.person_pin, color: AppColors.accent, size: 24),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(s['name'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                              Text('Code: ${s['code']}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(4)),
                          child: Text(s['role'] as String, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                        ),
                        const SizedBox(width: 16),
                        OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(foregroundColor: AppColors.foreground, side: const BorderSide(color: AppColors.border)),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('PIN reset prompt sent for ${s['name']}')),
                            );
                          },
                          icon: const Icon(Icons.pin, size: 14),
                          label: const Text('Change PIN', style: TextStyle(fontSize: 12)),
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

