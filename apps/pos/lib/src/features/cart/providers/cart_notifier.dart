import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../catalog/domain/models/product.dart';
import '../domain/cart_item.dart';

class CartState {
  final List<CartItem> items;
  final String? customerId;
  final String? customerName;
  final double discountAmount;
  final String? couponCode;

  const CartState({
    this.items = const [],
    this.customerId,
    this.customerName,
    this.discountAmount = 0.0,
    this.couponCode,
  });

  int get totalItemCount => items.fold(0, (sum, item) => sum + item.quantity);
  
  double get subtotal => items.fold(0.0, (sum, item) => sum + item.subtotal);
  
  double get taxAmount => items.fold(0.0, (sum, item) => sum + item.taxAmount);
  
  double get grandTotal {
    final net = (subtotal - discountAmount) + taxAmount;
    return net > 0 ? net : 0.0;
  }

  CartState copyWith({
    List<CartItem>? items,
    String? customerId,
    String? customerName,
    double? discountAmount,
    String? couponCode,
  }) {
    return CartState(
      items: items ?? this.items,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      discountAmount: discountAmount ?? this.discountAmount,
      couponCode: couponCode ?? this.couponCode,
    );
  }
}

class CartNotifier extends StateNotifier<CartState> {
  CartNotifier() : super(const CartState());

  void addItem(Product product, ProductVariant variant) {
    final existingIndex = state.items.indexWhere((i) => i.variant.id == variant.id);

    if (existingIndex >= 0) {
      final existing = state.items[existingIndex];
      final updatedList = List<CartItem>.from(state.items);
      updatedList[existingIndex] = existing.copyWith(quantity: existing.quantity + 1);
      state = state.copyWith(items: updatedList);
    } else {
      final newItem = CartItem(
        product: product,
        variant: variant,
        quantity: 1,
        unitPrice: variant.price,
      );
      state = state.copyWith(items: [...state.items, newItem]);
    }
  }

  void updateQuantity(String variantId, int newQuantity) {
    if (newQuantity <= 0) {
      removeItem(variantId);
      return;
    }

    final updatedList = state.items.map((item) {
      if (item.variant.id == variantId) {
        return item.copyWith(quantity: newQuantity);
      }
      return item;
    }).toList();

    state = state.copyWith(items: updatedList);
  }

  void removeItem(String variantId) {
    state = state.copyWith(
      items: state.items.where((i) => i.variant.id != variantId).toList(),
    );
  }

  void setCustomer(String? id, String? name) {
    state = state.copyWith(customerId: id, customerName: name);
  }

  void applyDiscount(double amount) {
    state = state.copyWith(discountAmount: amount);
  }

  void clearCart() {
    state = const CartState();
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  return CartNotifier();
});

