import 'dart:convert';

class LocalCachedSale {
  final String id;
  final String payloadJson;
  final DateTime createdAt;
  final bool isSynced;

  const LocalCachedSale({
    required this.id,
    required this.payloadJson,
    required this.createdAt,
    this.isSynced = false,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'payloadJson': payloadJson,
        'createdAt': createdAt.toIso8601String(),
        'isSynced': isSynced,
      };

  factory LocalCachedSale.fromJson(Map<String, dynamic> json) => LocalCachedSale(
        id: json['id'] as String,
        payloadJson: json['payloadJson'] as String,
        createdAt: DateTime.parse(json['createdAt'] as String),
        isSynced: json['isSynced'] as bool? ?? false,
      );
}

class AppDatabase {
  static final AppDatabase instance = AppDatabase._internal();
  AppDatabase._internal();

  // In-memory fallback and local SQLite registry for desktop/mobile POS
  final List<LocalCachedSale> _offlineQueue = [];
  final Map<String, dynamic> _localProductCache = {};

  Future<void> queueOfflineSale(String saleId, Map<String, dynamic> salePayload) async {
    final entry = LocalCachedSale(
      id: saleId,
      payloadJson: jsonEncode(salePayload),
      createdAt: DateTime.now(),
      isSynced: false,
    );
    _offlineQueue.add(entry);
  }

  Future<List<LocalCachedSale>> getPendingSales() async {
    return _offlineQueue.where((s) => !s.isSynced).toList();
  }

  Future<void> markSaleSynced(String saleId) async {
    final index = _offlineQueue.indexWhere((s) => s.id == saleId);
    if (index >= 0) {
      _offlineQueue[index] = LocalCachedSale(
        id: _offlineQueue[index].id,
        payloadJson: _offlineQueue[index].payloadJson,
        createdAt: _offlineQueue[index].createdAt,
        isSynced: true,
      );
    }
  }

  Future<void> cacheProducts(List<Map<String, dynamic>> products) async {
    for (final p in products) {
      if (p['id'] != null) {
        _localProductCache[p['id'] as String] = p;
      }
    }
  }

  Future<List<Map<String, dynamic>>> getCachedProducts() async {
    return _localProductCache.values.map((v) => v as Map<String, dynamic>).toList();
  }
}

