import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import 'src/core/constants/colors.dart';
import 'src/features/catalog/presentation/category_bar.dart';
import 'src/features/catalog/presentation/product_grid.dart';
import 'src/features/cart/presentation/cart_view.dart';
import 'src/features/auth/presentation/pin_login_screen.dart';
import 'src/features/shifts/presentation/shift_reconciliation_screen.dart';
import 'src/features/management/presentation/management_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: PosTerminalApp()));
}

class PosTerminalApp extends StatelessWidget {
  const PosTerminalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'themrktplace POS & Management',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          onPrimary: AppColors.onPrimary,
          surface: AppColors.surface,
          background: AppColors.background,
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      ),
      home: const PosTerminalShell(),
    );
  }
}

class PosTerminalShell extends StatefulWidget {
  const PosTerminalShell({super.key});

  @override
  State<PosTerminalShell> createState() => _PosTerminalShellState();
}

class _PosTerminalShellState extends State<PosTerminalShell> {
  bool _isManagementMode = false;
  bool _isLocked = false;
  bool _isOnline = true;
  String _currentCashierName = 'Aryan Verma';
  final String _currentStoreName = 'Flagship Store · Indiranagar';

  @override
  Widget build(BuildContext context) {
    if (_isLocked) {
      return PinLoginScreen(
        onSuccess: (staffName) {
          setState(() {
            _currentCashierName = staffName;
            _isLocked = false;
          });
        },
      );
    }

    if (_isManagementMode) {
      return ManagementShell(
        onBackToRegister: () {
          setState(() {
            _isManagementMode = false;
          });
        },
      );
    }

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(56),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(bottom: BorderSide(color: AppColors.border)),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              // Brand mark
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Center(
                  child: Text(
                    'M',
                    style: TextStyle(
                      color: AppColors.onPrimary,
                      fontWeight: FontWeight.w900,
                      fontSize: 18,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'themrktplace POS',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.foreground,
                    ),
                  ),
                  Text(
                    _currentStoreName,
                    style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                  ),
                ],
              ),
              const Spacer(),
              // Network Status Indicator
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _isOnline ? AppColors.successSubtle : AppColors.dangerSubtle,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: _isOnline ? AppColors.success : AppColors.danger,
                    width: 0.5,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _isOnline ? AppColors.success : AppColors.danger,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      _isOnline ? 'ONLINE' : 'OFFLINE MODE',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: _isOnline ? AppColors.success : AppColors.danger,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              // Open Store & Website Management Mode
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accent,
                  foregroundColor: AppColors.onPrimary,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  elevation: 0,
                ),
                onPressed: () {
                  setState(() {
                    _isManagementMode = true;
                  });
                },
                icon: const Icon(Icons.admin_panel_settings_outlined, size: 16),
                label: const Text('Store & Web Management', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              ),
              const SizedBox(width: 10),
              // Register Shift Button
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.foreground,
                  side: const BorderSide(color: AppColors.border),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (ctx) => const ShiftReconciliationScreen(
                      isOpening: false,
                      expectedCash: 6450.0,
                    ),
                  );
                },
                icon: const Icon(Icons.account_balance_wallet_outlined, size: 16, color: AppColors.accent),
                label: const Text('Shift Balance', style: TextStyle(fontSize: 12)),
              ),
              const SizedBox(width: 10),
              // Cashier badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.person_pin, size: 16, color: AppColors.accent),
                    const SizedBox(width: 6),
                    Text(
                      _currentCashierName,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.foreground),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              // Lock Terminal
              IconButton(
                tooltip: 'Lock Terminal (F12)',
                icon: const Icon(Icons.lock_outline, size: 18, color: AppColors.textMuted),
                onPressed: () {
                  setState(() {
                    _isLocked = true;
                  });
                },
              ),
            ],
          ),
        ),
      ),
      body: Row(
        children: [
          // Left Area: Catalog & Fast Touch Grid (62% width)
          Expanded(
            flex: 62,
            child: Column(
              children: [
                CategoryBar(
                  onSelectCategory: (catId) {},
                ),
                const Expanded(child: ProductGrid()),
              ],
            ),
          ),
          // Vertical Border
          Container(width: 1, color: AppColors.border),
          // Right Area: Active Cart & Tender Settlement (38% width)
          const Expanded(
            flex: 38,
            child: CartView(),
          ),
        ],
      ),
    );
  }
}
