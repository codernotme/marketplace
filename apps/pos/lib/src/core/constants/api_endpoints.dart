import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiEndpoints {
  static String get baseUrl {
    const fromEnv = String.fromEnvironment('API_URL');
    if (fromEnv.isNotEmpty) return fromEnv;
    if (!kIsWeb && Platform.isAndroid) {
      return 'http://10.0.2.2:3001/api/v1';
    }
    return 'http://localhost:3001/api/v1';
  }

  // Auth & Session
  static const String pinLogin = '/auth/pin-login';
  static const String refresh = '/auth/refresh';
  static const String logout = '/auth/logout';

  // Catalog
  static const String products = '/products';
  static const String categories = '/products/categories';

  // Inventory
  static const String inventory = '/inventory';
  static const String adjustInventory = '/inventory/adjust';

  // Sales & Checkout
  static const String sales = '/sales';
  static const String heldCarts = '/sales/held';

  // Shifts
  static const String shifts = '/shifts';

  // Customers
  static const String customers = '/customers';

  // Staff
  static const String staff = '/staff';

  // Reports
  static const String reportsEod = '/reports/eod';
  static const String reportsInventory = '/reports/inventory';
  static const String reportsCommissions = '/reports/commissions';
  static const String reportsGstr1 = '/reports/export-gstr1';

  // Business & Website Management
  static const String businessStatus = '/business/status';
  static const String businessProfile = '/business/profile';
  static const String webOrders = '/website/orders/manage';
  static const String webSettings = '/website/settings';
}
