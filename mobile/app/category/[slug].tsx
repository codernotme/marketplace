// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'heroui-native';

import { BrandLoader } from '@/components/brand-loader';
import { ProductCard, Screen } from '@/components/storefront';
import { fetchCategoryBySlug, fetchProductsByCategory, fetchProducts } from '@/lib/api';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchCategoryBySlug(String(slug)),
      fetchProductsByCategory(String(slug)),
      fetchProducts(),
    ]).then(([categoryData, categoryProducts, allProducts]) => {
      if (!active) return;
      setCategory(categoryData || null);
      setProducts(categoryProducts.length > 0 ? categoryProducts : allProducts);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <BrandLoader subtitle="Loading category" />;
  }

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#D1D5DB" />
        <Text className="text-black font-black text-2xl mt-4 mb-2">Category not found</Text>
        <Text className="text-gray-500 text-center mb-5">We could not locate that category in the catalogue.</Text>
        <Button variant="primary" onPress={() => router.back()}>
          <Button.Label>Go Back</Button.Label>
        </Button>
      </View>
    );
  }

  return (
    <Screen>
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Button variant="secondary" size="sm" onPress={() => router.back()}>
          <Button.Label>
            <Ionicons name="arrow-back" size={16} color="#111" />
          </Button.Label>
        </Button>
        <Text className="text-black font-black text-lg">{category.name}</Text>
        <View className="w-10 h-10" />
      </View>

      <View className="px-4 mb-5">
        <View className="rounded-[30px] overflow-hidden h-56 bg-black">
          <Image source={{ uri: category.image }} className="w-full h-full" contentFit="cover" />
          <View className="absolute inset-0 bg-black/45" />
          <View className="absolute inset-0 p-6 justify-end">
            <Text className="text-white/80 text-xs font-bold uppercase tracking-[3px] mb-1">Category</Text>
            <Text className="text-white text-4xl font-black tracking-tight">{category.name}</Text>
            <Text className="text-white/70 mt-2">{category.count} products available</Text>
          </View>
        </View>
      </View>

      <View className="px-4 flex-row flex-wrap justify-between">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    </Screen>
  );
}
