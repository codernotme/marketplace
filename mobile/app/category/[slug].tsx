// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, Pressable } from 'react-native';

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
        <Text className="text-black font-bold text-2xl mt-4 mb-2 font-display">Category not found</Text>
        <Text className="text-gray-500 text-center mb-6 font-body">We could not locate that category in the catalogue.</Text>
        <Pressable 
          onPress={() => router.back()}
          className="bg-black h-12 px-8 rounded-full items-center justify-center"
        >
          <Text className="text-white font-bold text-sm uppercase tracking-widest font-mono">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Screen bg="bg-white">
      <View className="px-4 pt-2 pb-6 flex-row items-center justify-between">
        <Pressable 
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-[#F5F5F5] border border-black/5 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="#111" />
        </Pressable>
        <Text className="text-black font-bold text-xl font-display tracking-tight uppercase">{category.name}</Text>
        <View className="w-11 h-11" />
      </View>

      <View className="px-4 mb-8">
        <View className="rounded-[40px] overflow-hidden h-64 bg-black relative border border-black/5">
          <Image source={{ uri: category.image }} className="absolute inset-0 w-full h-full opacity-60" contentFit="cover" />
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute inset-0 p-8 justify-end">
            <View className="flex-row items-center gap-2 mb-2">
               <View className="w-1.5 h-1.5 rounded-full bg-[#84D347]" />
               <Text className="text-[10px] font-black uppercase tracking-[3px] text-[#84D347] font-mono">Category</Text>
            </View>
            <Text className="text-white text-5xl font-bold tracking-tight font-display leading-[48px]">{category.name}</Text>
            <Text className="text-white/60 mt-3 font-body text-sm uppercase tracking-wider">{category.count} items in collection</Text>
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
