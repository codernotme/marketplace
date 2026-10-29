import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class OverviewView extends StatelessWidget {
  final Function(int tabIndex) onNavigateTab;

  const OverviewView({super.key, required this.onNavigateTab});

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
                  Text(
                    'Store & Website Operations Overview',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Real-time omnichannel sales, web orders, and inventory status',
                    style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                  ),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.onPrimary,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                onPressed: () => onNavigateTab(3), // Navigate to Web Orders
                icon: const Icon(Icons.shopping_bag_outlined, size: 16),
                label: const Text('Fulfill Web Orders', style: TextStyle(fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Metric Cards Row
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  title: "Today's Gross Sales",
                  value: '₹64,280.00',
                  subtitle: '+18.4% vs yesterday',
                  icon: Icons.currency_rupee,
                  color: AppColors.accent,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: _buildMetricCard(
                  title: 'Register Orders (POS)',
                  value: '38 orders',
                  subtitle: 'Average order ₹1,691',
                  icon: Icons.point_of_sale,
                  color: AppColors.success,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: _buildMetricCard(
                  title: 'Website Web Orders',
                  value: '7 pending',
                  subtitle: 'Requires packing & dispatch',
                  icon: Icons.public,
                  color: AppColors.warning,
                  onTap: () => onNavigateTab(3),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: _buildMetricCard(
                  title: 'Low Stock Alerts',
                  value: '3 variants',
                  subtitle: 'Below threshold of 5 units',
                  icon: Icons.warning_amber_rounded,
                  color: AppColors.danger,
                  onTap: () => onNavigateTab(2),
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),
          // Quick Management Action Banners
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Online Storefront Status Banner
              Expanded(
                flex: 55,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.storefront, color: AppColors.accent, size: 20),
                              SizedBox(width: 8),
                              Text(
                                'D2C Customer Website Status',
                                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.foreground),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.successSubtle,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.success, width: 0.5),
                            ),
                            child: const Text('LIVE & ACCEPTING ORDERS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.success)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Text(
                        'Active Announcement Banner:',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: const Text(
                          '"Welcome to our flagship online store. Free express delivery on orders over ₹1,999."',
                          style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: AppColors.foreground),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.foreground,
                              side: const BorderSide(color: AppColors.border),
                            ),
                            onPressed: () => onNavigateTab(7), // Website settings
                            icon: const Icon(Icons.edit_note, size: 16),
                            label: const Text('Edit Website Banner & Settings', style: TextStyle(fontSize: 12)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Fast Register Cash Reconciliation
              Expanded(
                flex: 45,
                child: Container(
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
                        children: [
                          Icon(Icons.point_of_sale_outlined, color: AppColors.accent, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Active Register Shift',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.foreground),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      _buildRow('Opening Float', '₹5,000.00'),
                      const SizedBox(height: 6),
                      _buildRow('Cash Collected Today', '₹18,450.00'),
                      const SizedBox(height: 6),
                      _buildRow('Digital / UPI / Cards', '₹45,830.00'),
                      const Divider(color: AppColors.border, height: 18),
                      _buildRow('Expected in Drawer', '₹23,450.00', isBold: true),
                      const SizedBox(height: 14),
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.foreground,
                          side: const BorderSide(color: AppColors.border),
                        ),
                        onPressed: () => onNavigateTab(5), // Reports
                        icon: const Icon(Icons.assessment_outlined, size: 16),
                        label: const Text('View Full Financial EOD Report', style: TextStyle(fontSize: 12)),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color color,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textMuted)),
                Icon(icon, size: 18, color: color),
              ],
            ),
            const SizedBox(height: 10),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.foreground)),
            const SizedBox(height: 4),
            Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 12, color: isBold ? AppColors.foreground : AppColors.textMuted, fontWeight: isBold ? FontWeight.w700 : FontWeight.w400)),
        Text(value, style: TextStyle(fontSize: 12, color: AppColors.foreground, fontWeight: isBold ? FontWeight.w800 : FontWeight.w600)),
      ],
    );
  }
}

