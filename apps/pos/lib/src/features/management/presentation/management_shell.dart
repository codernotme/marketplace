import 'package:flutter/material.dart';
import '../../../core/constants/colors.dart';
import 'views/overview_view.dart';
import 'views/products_management_view.dart';
import 'views/inventory_management_view.dart';
import 'views/web_orders_view.dart';
import 'views/customer_crm_view.dart';
import 'views/reports_view.dart';
import 'views/staff_view.dart';
import 'views/website_settings_view.dart';

class ManagementShell extends StatefulWidget {
  final VoidCallback onBackToRegister;

  const ManagementShell({super.key, required this.onBackToRegister});

  @override
  State<ManagementShell> createState() => _ManagementShellState();
}

class _ManagementShellState extends State<ManagementShell> {
  int _activeTabIndex = 0;

  final List<Map<String, dynamic>> _tabs = const [
    {'title': 'Overview', 'icon': Icons.dashboard_outlined},
    {'title': 'Products & Catalog', 'icon': Icons.checkroom_outlined},
    {'title': 'Inventory & Stock', 'icon': Icons.inventory_2_outlined},
    {'title': 'Website Orders', 'icon': Icons.public_outlined},
    {'title': 'Customers & CRM', 'icon': Icons.people_outline},
    {'title': 'Reports & GST', 'icon': Icons.assessment_outlined},
    {'title': 'Staff & PINs', 'icon': Icons.badge_outlined},
    {'title': 'Website Settings', 'icon': Icons.settings_outlined},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Row(
        children: [
          // Left Sidebar Navigation (240px)
          Container(
            width: 250,
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(right: BorderSide(color: AppColors.border)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Header: Return to Register
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: AppColors.onPrimary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: widget.onBackToRegister,
                      icon: const Icon(Icons.point_of_sale, size: 18),
                      label: const Text('Back to Register', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                    ),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                  child: Text(
                    'STORE & WEBSITE MANAGEMENT',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 0.5),
                  ),
                ),
                // Navigation items
                Expanded(
                  child: ListView.builder(
                    itemCount: _tabs.length,
                    itemBuilder: (context, index) {
                      final tab = _tabs[index];
                      final isSelected = _activeTabIndex == index;

                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                        child: InkWell(
                          onTap: () {
                            setState(() {
                              _activeTabIndex = index;
                            });
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.card : Colors.transparent,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: isSelected ? AppColors.border : Colors.transparent,
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  tab['icon'] as IconData,
                                  size: 18,
                                  color: isSelected ? AppColors.accent : AppColors.textMuted,
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  tab['title'] as String,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                    color: isSelected ? AppColors.foreground : AppColors.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                // Footer
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(
                    border: Border(top: BorderSide(color: AppColors.border)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.shield_outlined, size: 16, color: AppColors.accent),
                      SizedBox(width: 8),
                      Text('themrktplace Suite v1.0', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Main Content View
          Expanded(
            child: _buildActiveView(),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveView() {
    switch (_activeTabIndex) {
      case 0:
        return OverviewView(onNavigateTab: (tabIndex) => setState(() => _activeTabIndex = tabIndex));
      case 1:
        return const ProductsManagementView();
      case 2:
        return const InventoryManagementView();
      case 3:
        return const WebOrdersView();
      case 4:
        return const CustomerCrmView();
      case 5:
        return const ReportsView();
      case 6:
        return const StaffView();
      case 7:
        return const WebsiteSettingsView();
      default:
        return const SizedBox();
    }
  }
}

