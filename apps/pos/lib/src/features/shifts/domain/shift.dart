class Shift {
  final String id;
  final String staffId;
  final String storeId;
  final double openingCash;
  final double? closingCash;
  final double? expectedCash;
  final double? discrepancy;
  final DateTime openedAt;
  final DateTime? closedAt;
  final String? notes;

  const Shift({
    required this.id,
    required this.staffId,
    required this.storeId,
    required this.openingCash,
    this.closingCash,
    this.expectedCash,
    this.discrepancy,
    required this.openedAt,
    this.closedAt,
    this.notes,
  });

  bool get isOpen => closedAt == null;

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      id: json['id'] as String,
      staffId: json['staffId'] as String,
      storeId: json['storeId'] as String,
      openingCash: (json['openingCash'] as num).toDouble(),
      closingCash: json['closingCash'] != null ? (json['closingCash'] as num).toDouble() : null,
      expectedCash: json['expectedCash'] != null ? (json['expectedCash'] as num).toDouble() : null,
      discrepancy: json['discrepancy'] != null ? (json['discrepancy'] as num).toDouble() : null,
      openedAt: DateTime.parse(json['openedAt'] as String),
      closedAt: json['closedAt'] != null ? DateTime.parse(json['closedAt'] as String) : null,
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'staffId': staffId,
      'storeId': storeId,
      'openingCash': openingCash,
      'closingCash': closingCash,
      'expectedCash': expectedCash,
      'discrepancy': discrepancy,
      'openedAt': openedAt.toIso8601String(),
      'closedAt': closedAt?.toIso8601String(),
      'notes': notes,
    };
  }
}

