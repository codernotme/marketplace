import 'dart:typed_data';

/// ESC/POS Thermal Receipt Printer Bridge
class PrinterService {
  PrinterService._();
  static final PrinterService instance = PrinterService._();

  // Standard ESC/POS Command Constants
  static const List<int> initPrinter = [0x1B, 0x40];
  static const List<int> alignCenter = [0x1B, 0x61, 0x01];
  static const List<int> alignLeft = [0x1B, 0x61, 0x00];
  static const List<int> alignRight = [0x1B, 0x61, 0x02];
  static const List<int> boldOn = [0x1B, 0x45, 0x01];
  static const List<int> boldOff = [0x1B, 0x45, 0x00];
  static const List<int> cutPaper = [0x1D, 0x56, 0x41, 0x00];
  static const List<int> kickDrawer = [0x1B, 0x70, 0x00, 0x19, 0xFA];

  /// Builds raw ESC/POS byte sequence for an 80mm thermal receipt
  Uint8List buildReceiptBytes({
    required String storeName,
    required String invoiceNumber,
    required List<Map<String, dynamic>> items,
    required double subtotal,
    required double taxAmount,
    required double grandTotal,
  }) {
    final List<int> bytes = [];

    // 1. Initialize
    bytes.addAll(initPrinter);

    // 2. Header
    bytes.addAll(alignCenter);
    bytes.addAll(boldOn);
    bytes.addAll(storeName.codeUnits);
    bytes.addAll([0x0A]); // Newline
    bytes.addAll(boldOff);
    bytes.addAll('Retail Tax Invoice\n'.codeUnits);
    bytes.addAll('Invoice #: $invoiceNumber\n'.codeUnits);
    bytes.addAll('--------------------------------\n'.codeUnits);

    // 3. Line Items
    bytes.addAll(alignLeft);
    for (final item in items) {
      final name = item['name'] as String;
      final qty = item['quantity'] as int;
      final price = (item['price'] as double).toStringAsFixed(2);
      final line = '$qty x $name  Rs.$price\n';
      bytes.addAll(line.codeUnits);
    }
    bytes.addAll('--------------------------------\n'.codeUnits);

    // 4. Totals
    bytes.addAll(alignRight);
    bytes.addAll('Subtotal: Rs.${subtotal.toStringAsFixed(2)}\n'.codeUnits);
    bytes.addAll('Tax: Rs.${taxAmount.toStringAsFixed(2)}\n'.codeUnits);
    bytes.addAll(boldOn);
    bytes.addAll('Grand Total: Rs.${grandTotal.toStringAsFixed(2)}\n'.codeUnits);
    bytes.addAll(boldOff);

    // 5. Footer & Cut
    bytes.addAll(alignCenter);
    bytes.addAll('\nThank you for shopping!\n\n\n'.codeUnits);
    bytes.addAll(cutPaper);

    // 6. Cash drawer trigger
    bytes.addAll(kickDrawer);

    return Uint8List.fromList(bytes);
  }
}
