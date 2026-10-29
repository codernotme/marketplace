import 'package:flutter/material.dart';
import '../../../core/constants/colors.dart';

class CategoryBar extends StatefulWidget {
  final Function(String? categoryId) onSelectCategory;

  const CategoryBar({super.key, required this.onSelectCategory});

  @override
  State<CategoryBar> createState() => _CategoryBarState();
}

class _CategoryBarState extends State<CategoryBar> {
  String? _selectedCategory;

  final List<Map<String, String?>> _categories = const [
    {'id': null, 'name': 'All Categories'},
    {'id': 'cat_shirts', 'name': 'Tops & Shirts'},
    {'id': 'cat_trousers', 'name': 'Trousers & Pants'},
    {'id': 'cat_outerwear', 'name': 'Outerwear & Blazers'},
    {'id': 'cat_dresses', 'name': 'Dresses & Skirts'},
    {'id': 'cat_accessories', 'name': 'Accessories & Belts'},
    {'id': 'cat_footwear', 'name': 'Footwear'},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        scrollDirection: Axis.horizontal,
        itemCount: _categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = _categories[index];
          final isSelected = _selectedCategory == cat['id'];

          return InkWell(
            onTap: () {
              setState(() {
                _selectedCategory = cat['id'];
              });
              widget.onSelectCategory(cat['id']);
            },
            borderRadius: BorderRadius.circular(6),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : AppColors.card,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: isSelected ? AppColors.primary : AppColors.border,
                ),
              ),
              child: Center(
                child: Text(
                  cat['name']!,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    color: isSelected ? AppColors.onPrimary : AppColors.foreground,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

