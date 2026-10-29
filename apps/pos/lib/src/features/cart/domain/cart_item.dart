import '../../catalog/domain/models/product.dart';

class CartItem {
  final Product product;
  final ProductVariant variant;
  final int quantity;
  final double unitPrice;
  final double discountAmount;
  final double taxRate;

  const CartItem({
    required this.product,
    required this.variant,
    required this.quantity,
    required this.unitPrice,
    this.discountAmount = 0.0,
    this.taxRate = 18.0,
  });

  double get subtotal => unitPrice * quantity;
  double get totalAfterDiscount => subtotal - discountAmount;
  double get taxAmount => (totalAfterDiscount * taxRate) / 100;
  double get total => totalAfterDiscount + taxAmount;

  CartItem copyWith({
    int? quantity,
    double? unitPrice,
    double? discountAmount,
    double? taxRate,
  }) {
    return CartItem(
      product: product,
      variant: variant,
      quantity: quantity ?? this.quantity,
      unitPrice: unitPrice ?? this.unitPrice,
      discountAmount: discountAmount ?? this.discountAmount,
      taxRate: taxRate ?? this.taxRate,
    );
  }
}

