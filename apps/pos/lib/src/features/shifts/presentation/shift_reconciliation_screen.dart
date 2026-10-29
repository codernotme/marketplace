import 'package:flutter/material.dart';
import '../../../core/constants/colors.dart';

class ShiftReconciliationScreen extends StatefulWidget {
  final bool isOpening;
  final double expectedCash;

  const ShiftReconciliationScreen({
    super.key,
    this.isOpening = false,
    this.expectedCash = 5000.0,
  });

  @override
  State<ShiftReconciliationScreen> createState() => _ShiftReconciliationScreenState();
}

class _ShiftReconciliationScreenState extends State<ShiftReconciliationScreen> {
  final Map<int, int> _denominations = {
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
  };
  int _coins = 0;
  final TextEditingController _notesController = TextEditingController();

  double get _totalCounted {
    double sum = _coins.toDouble();
    _denominations.forEach((denom, count) {
      sum += denom * count;
    });
    return sum;
  }

  double get _discrepancy => _totalCounted - widget.expectedCash;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.border),
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 640),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.isOpening ? 'Open Register Shift' : 'End of Shift Cash Balancing',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppColors.foreground,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        widget.isOpening
                            ? 'Enter the starting cash float inside drawer'
                            : 'Count physical currency in drawer to reconcile with sales',
                        style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close, color: AppColors.textMuted),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Divider(color: AppColors.border, height: 1),
              const SizedBox(height: 16),

              // Denominations Grid
              const Text(
                'Currency Denominations Count',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.foreground),
              ),
              const SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 3,
                shrinkWrap: true,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 2.2,
                children: _denominations.entries.map((entry) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.card,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '₹${entry.key}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.accent,
                          ),
                        ),
                        SizedBox(
                          width: 60,
                          child: TextFormField(
                            initialValue: entry.value == 0 ? '' : entry.value.toString(),
                            keyboardType: TextInputType.number,
                            textAlign: TextAlign.center,
                            style: const TextStyle(fontSize: 14, color: AppColors.foreground),
                            decoration: InputDecoration(
                              hintText: '0',
                              hintStyle: const TextStyle(color: AppColors.textMuted),
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(4),
                                borderSide: const BorderSide(color: AppColors.border),
                              ),
                            ),
                            onChanged: (val) {
                              setState(() {
                                _denominations[entry.key] = int.tryParse(val) ?? 0;
                              });
                            },
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 16),
              // Summary cards
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Counted Total', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                        const SizedBox(height: 4),
                        Text(
                          '₹${_totalCounted.toStringAsFixed(2)}',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.foreground),
                        ),
                      ],
                    ),
                    if (!widget.isOpening) ...[
                      Container(width: 1, height: 36, color: AppColors.border),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Expected Cash', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                          const SizedBox(height: 4),
                          Text(
                            '₹${widget.expectedCash.toStringAsFixed(2)}',
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.foreground),
                          ),
                        ],
                      ),
                      Container(width: 1, height: 36, color: AppColors.border),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Discrepancy', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                          const SizedBox(height: 4),
                          Text(
                            _discrepancy >= 0 ? '+₹${_discrepancy.toStringAsFixed(2)}' : '-₹${_discrepancy.abs().toStringAsFixed(2)}',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: _discrepancy == 0
                                  ? AppColors.success
                                  : (_discrepancy > 0 ? AppColors.warning : AppColors.danger),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 16),
              TextField(
                controller: _notesController,
                style: const TextStyle(fontSize: 13, color: AppColors.foreground),
                decoration: InputDecoration(
                  hintText: 'Add shift notes or explanation for any cash variance...',
                  hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                  filled: true,
                  fillColor: AppColors.card,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: AppColors.border),
                  ),
                ),
              ),

              const SizedBox(height: 24),
              // Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.textMuted,
                      side: const BorderSide(color: AppColors.border),
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Cancel'),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.onPrimary,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    ),
                    onPressed: () {
                      Navigator.of(context).pop({
                        'totalCash': _totalCounted,
                        'discrepancy': _discrepancy,
                        'notes': _notesController.text,
                      });
                    },
                    child: Text(
                      widget.isOpening ? 'Confirm & Open Shift' : 'Reconcile & Close Shift',
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

