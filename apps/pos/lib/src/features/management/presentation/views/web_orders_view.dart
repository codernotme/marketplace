import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class WebOrdersView extends StatefulWidget {
  const WebOrdersView({super.key});

  @override
  State<WebOrdersView> createState() => _WebOrdersViewState();
}

class _WebOrdersViewState extends State<WebOrdersView> {
  String _selectedStatus = 'ALL';

  final List<Map<String, dynamic>> _webOrders = [
    {
      'id': 'WEB-1092',
      'customerName': 'Neha Sharma',
      'customerPhone': '+91 98765 43210',
      'address': 'Flat 402, Prestige Palms, Indiranagar, Bengaluru, 560038',
      'items': [
        {'name': 'Oxford Cotton Shirt (M)', 'quantity': 1, 'price': 1899.00},
        {'name': 'Slim Fit Chino Trouser (32)', 'quantity': 1, 'price': 2499.00},
      ],
      'grandTotal': 5189.62,
      'paymentMethod': 'ONLINE_RAZORPAY',
      'deliveryType': 'HOME_DELIVERY',
      'fulfillmentStatus': 'PENDING',
      'timeAgo': '14 mins ago',
    },
    {
      'id': 'WEB-1091',
      'customerName': 'Rohan Nair',
      'customerPhone': '+91 98111 22334',
      'address': 'BOPIS Pick Up at Store Counter',
      'items': [
        {'name': 'Linen Summer Blazer (40)', 'quantity': 1, 'price': 4999.00},
      ],
      'grandTotal': 5898.82,
      'paymentMethod': 'ONLINE_RAZORPAY',
      'deliveryType': 'BOPIS_STORE_PICKUP',
      'fulfillmentStatus': 'PACKED',
      'timeAgo': '1 hr ago',
    },
    {
      'id': 'WEB-1090',
      'customerName': 'Priya Patel',
      'customerPhone': '+91 99887 76655',
      'address': 'Plot 12, Koramangala 4th Block, Bengaluru, 560034',
      'items': [
        {'name': 'Ribbed Knit Midi Dress (S)', 'quantity': 1, 'price': 3299.00},
      ],
      'grandTotal': 3892.82,
      'paymentMethod': 'COD',
      'deliveryType': 'HOME_DELIVERY',
      'fulfillmentStatus': 'SHIPPED',
      'timeAgo': '4 hrs ago',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredOrders = _selectedStatus == 'ALL'
        ? _webOrders
        : _webOrders.where((o) => o['fulfillmentStatus'] == _selectedStatus).toList();

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
                  Text('D2C Website Customer Orders', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                  SizedBox(height: 4),
                  Text('Manage, pack, and fulfill online orders placed on the website', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                ],
              ),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.warningSubtle,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.warning),
                    ),
                    child: Text(
                      '${_webOrders.where((o) => o['fulfillmentStatus'] == 'PENDING').length} PENDING FULFILLMENT',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.warning),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Filter Chips Row
          Row(
            children: ['ALL', 'PENDING', 'PACKED', 'SHIPPED', 'DELIVERED'].map((status) {
              final isSelected = _selectedStatus == status;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(status.replaceAll('_', ' ')),
                  selected: isSelected,
                  selectedColor: AppColors.primary,
                  backgroundColor: AppColors.card,
                  labelStyle: TextStyle(
                    fontSize: 11,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    color: isSelected ? AppColors.onPrimary : AppColors.foreground,
                  ),
                  side: BorderSide(color: isSelected ? AppColors.primary : AppColors.border),
                  onSelected: (val) {
                    if (val) setState(() => _selectedStatus = status);
                  },
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 18),
          // Orders List
          Expanded(
            child: ListView.separated(
              itemCount: filteredOrders.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final order = filteredOrders[index];
                final status = order['fulfillmentStatus'] as String;
                final isBopis = order['deliveryType'] == 'BOPIS_STORE_PICKUP';

                return Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Text(
                                order['id'] as String,
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.accent),
                              ),
                              const SizedBox(width: 10),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: isBopis ? AppColors.accentSubtle : AppColors.surface,
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(color: isBopis ? AppColors.accent : AppColors.border),
                                ),
                                child: Text(
                                  isBopis ? 'Click & Collect (BOPIS)' : 'Courier Delivery',
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: isBopis ? AppColors.accent : AppColors.textMuted),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text('· ${order['timeAgo']}', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                            ],
                          ),
                          _buildStatusBadge(status),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 50,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Customer: ${order['customerName']} (${order['customerPhone']})',
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Destination: ${order['address']}',
                                  style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            flex: 30,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Order Items:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                                ...(order['items'] as List).map((i) => Text(
                                      '• ${i['quantity']}x ${i['name']}',
                                      style: const TextStyle(fontSize: 12, color: AppColors.foreground),
                                    )),
                              ],
                            ),
                          ),
                          Expanded(
                            flex: 20,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                const Text('Total Amount', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                Text(
                                  '₹${(order['grandTotal'] as double).toStringAsFixed(2)}',
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.foreground),
                                ),
                                Text(
                                  order['paymentMethod'] == 'COD' ? 'Cash On Delivery' : 'Paid Online (Razorpay)',
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: order['paymentMethod'] == 'COD' ? AppColors.warning : AppColors.success,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Divider(color: AppColors.border, height: 1),
                      const SizedBox(height: 12),
                      // Order Action Buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (status == 'PENDING') ...[
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: AppColors.onPrimary,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              ),
                              onPressed: () {
                                setState(() {
                                  order['fulfillmentStatus'] = 'PACKED';
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Order ${order['id']} marked as PACKED')),
                                );
                              },
                              icon: const Icon(Icons.inventory_2_outlined, size: 16),
                              label: const Text('Mark as Packed', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                            ),
                          ],
                          if (status == 'PACKED') ...[
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.accent,
                                foregroundColor: AppColors.onPrimary,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              ),
                              onPressed: () {
                                setState(() {
                                  order['fulfillmentStatus'] = isBopis ? 'DELIVERED' : 'SHIPPED';
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text(isBopis ? 'Customer picked up order!' : 'Order dispatched with courier!')),
                                );
                              },
                              icon: Icon(isBopis ? Icons.store : Icons.local_shipping_outlined, size: 16),
                              label: Text(isBopis ? 'Customer Handover (Complete)' : 'Dispatch Courier (Shiprocket)', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bg;
    Color fg;
    switch (status) {
      case 'PENDING':
        bg = AppColors.warningSubtle;
        fg = AppColors.warning;
        break;
      case 'PACKED':
        bg = AppColors.accentSubtle;
        fg = AppColors.accent;
        break;
      case 'SHIPPED':
        bg = const Color(0x223B82F6);
        fg = const Color(0xFF3B82F6);
        break;
      case 'DELIVERED':
        bg = AppColors.successSubtle;
        fg = AppColors.success;
        break;
      default:
        bg = AppColors.surface;
        fg = AppColors.textMuted;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        status,
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: fg),
      ),
    );
  }
}

