import 'package:flutter/material.dart';
import '../../../core/constants/colors.dart';

class PinLoginScreen extends StatefulWidget {
  final Function(String cashierName)? onSuccess;
  final VoidCallback? onAuthenticated;

  const PinLoginScreen({
    super.key,
    this.onSuccess,
    this.onAuthenticated,
  });

  @override
  State<PinLoginScreen> createState() => _PinLoginScreenState();
}

class _PinLoginScreenState extends State<PinLoginScreen> {
  String _pin = '';

  void _onKeyPress(String digit) {
    if (_pin.length < 6) {
      setState(() => _pin += digit);
      if (_pin.length == 4 || _pin.length == 6) {
        _verifyPin();
      }
    }
  }

  void _onBackspace() {
    if (_pin.isNotEmpty) {
      setState(() => _pin = _pin.substring(0, _pin.length - 1));
    }
  }

  void _verifyPin() {
    // In production, verify hash locally against offline SQLite or via API
    if (_pin == '1234' || _pin.length >= 4) {
      if (widget.onSuccess != null) {
        widget.onSuccess!('Aryan Verma');
      }
      if (widget.onAuthenticated != null) {
        widget.onAuthenticated!();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Container(
          width: 360,
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.lock_clock_outlined, size: 36, color: AppColors.foreground),
              const SizedBox(height: 12),
              const Text(
                'POS Terminal Lock',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.foreground),
              ),
              const SizedBox(height: 4),
              const Text(
                'Enter your 4 or 6-digit cashier PIN',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
              const SizedBox(height: 24),
              // PIN Dots Display
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (index) {
                  final isFilled = index < _pin.length;
                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                    width: 14,
                    height: 14,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isFilled ? AppColors.foreground : Colors.transparent,
                      border: Border.all(color: isFilled ? AppColors.foreground : AppColors.border, width: 2),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 28),
              // Numeric Keypad
              GridView.count(
                shrinkWrap: true,
                crossAxisCount: 3,
                childAspectRatio: 1.3,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                children: [
                  ...List.generate(9, (i) => _buildKey('${i + 1}')),
                  IconButton(
                    icon: const Icon(Icons.clear, color: AppColors.danger),
                    onPressed: () => setState(() => _pin = ''),
                  ),
                  _buildKey('0'),
                  IconButton(
                    icon: const Icon(Icons.backspace_outlined, color: AppColors.textMuted),
                    onPressed: _onBackspace,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKey(String label) {
    return InkWell(
      onTap: () => _onKeyPress(label),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.border),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.foreground),
        ),
      ),
    );
  }
}
