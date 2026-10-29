import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';

class WebsiteSettingsView extends StatefulWidget {
  const WebsiteSettingsView({super.key});

  @override
  State<WebsiteSettingsView> createState() => _WebsiteSettingsViewState();
}

class _WebsiteSettingsViewState extends State<WebsiteSettingsView> {
  final TextEditingController _brandCtrl = TextEditingController(text: 'themrktplace Flagship');
  final TextEditingController _bannerCtrl = TextEditingController(text: 'Festive Season: Free express delivery on orders over ₹1,999. Use code FESTIVE10');
  final TextEditingController _collectionCtrl = TextEditingController(text: 'Autumn / Winter Collection 2026');
  final TextEditingController _phoneCtrl = TextEditingController(text: '+91 98765 43210');
  final TextEditingController _emailCtrl = TextEditingController(text: 'care@themrktplace.com');
  final TextEditingController _gstinCtrl = TextEditingController(text: '29ABCDE1234F1Z5');

  bool _websiteOnline = true;
  bool _bopisEnabled = true;
  bool _codEnabled = true;

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
                  Text('D2C Website & Brand Settings', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                  SizedBox(height: 4),
                  Text('Configure customer website announcements, omnichannel ordering, and brand identity', style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.onPrimary,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Website settings saved and published live!')),
                  );
                },
                icon: const Icon(Icons.cloud_upload_outlined, size: 18),
                label: const Text('Save & Publish Live', style: TextStyle(fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Website Live Status Switcher Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Online Web Storefront Access', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                    const SizedBox(height: 4),
                    Text(
                      _websiteOnline
                          ? 'The website is actively accepting customer traffic and online checkout.'
                          : 'The website is currently in maintenance mode.',
                      style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                  ],
                ),
                Switch(
                  value: _websiteOnline,
                  activeColor: AppColors.success,
                  onChanged: (val) => setState(() => _websiteOnline = val),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Website Announcement Banner Card
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
                const Text('Top Announcement Banner', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                const SizedBox(height: 4),
                const Text('Displayed at the very top of the customer website across all pages', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                const SizedBox(height: 14),
                TextField(
                  controller: _bannerCtrl,
                  style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                  decoration: InputDecoration(
                    hintText: 'e.g. End of Season Sale: Flat 30% off all apparel',
                    hintStyle: const TextStyle(color: AppColors.textMuted),
                    filled: true,
                    fillColor: AppColors.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _collectionCtrl,
                  style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                  decoration: InputDecoration(
                    labelText: 'Featured Homepage Collection Title',
                    labelStyle: const TextStyle(color: AppColors.textMuted),
                    filled: true,
                    fillColor: AppColors.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: AppColors.border)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Omnichannel Fulfillment Options
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
                const Text('Customer Checkout & Delivery Rules', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                const SizedBox(height: 14),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Enable In-Store Pickup (BOPIS)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                  subtitle: const Text('Allow website customers to order online and collect from physical store counter', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                  value: _bopisEnabled,
                  activeColor: AppColors.accent,
                  onChanged: (val) => setState(() => _bopisEnabled = val),
                ),
                const Divider(color: AppColors.border),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Enable Cash on Delivery (COD)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.foreground)),
                  subtitle: const Text('Accept cash payment upon courier doorstep delivery', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                  value: _codEnabled,
                  activeColor: AppColors.accent,
                  onChanged: (val) => setState(() => _codEnabled = val),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Brand Contact & GST Information
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
                const Text('Store Legal & GST Profile', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.foreground)),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _brandCtrl,
                        style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                        decoration: InputDecoration(
                          labelText: 'Brand / Store Name',
                          filled: true,
                          fillColor: AppColors.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: TextField(
                        controller: _gstinCtrl,
                        style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                        decoration: InputDecoration(
                          labelText: 'GSTIN Number',
                          filled: true,
                          fillColor: AppColors.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _emailCtrl,
                        style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                        decoration: InputDecoration(
                          labelText: 'Customer Support Email',
                          filled: true,
                          fillColor: AppColors.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: TextField(
                        controller: _phoneCtrl,
                        style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                        decoration: InputDecoration(
                          labelText: 'Support Phone / WhatsApp',
                          filled: true,
                          fillColor: AppColors.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

