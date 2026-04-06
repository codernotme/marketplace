import React from 'react';
import { router } from 'expo-router';
import { Pressable, Text, TextInput, View, ScrollView } from 'react-native';

import { ProductCard, Screen, SectionHeading, SiteHeader } from '@/components/storefront';
import { fetchCategories, fetchProducts, fetchStorefrontContent } from '@/lib/api';

export default function ShopScreen() {
  const { useEffect, useState } = React as any;
  const [products, setProducts] = useState([] as any[]);
  const [categories, setCategories] = useState([] as any[]);
  const [content, setContent] = useState(null as any);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchStorefrontContent()]).then(([loadedProducts, loadedCategories, loadedContent]) => {
      setProducts(loadedProducts);
      setCategories(loadedCategories);
      setContent(loadedContent);
    });
  }, []);

  const shopContent = content?.shop;

  return (
    <Screen>
      <SiteHeader title={shopContent?.title || 'Full Catalogue'} subtitle={shopContent?.subtitle || 'Browse'} />

      <View className="px-4 mb-4">
        <View className="flex-row items-center gap-3 bg-[#F5F5F5] rounded-2xl px-4 h-14">
          <Text className="text-gray-400">{shopContent?.searchLeadingLabel || 'Search'}</Text>
          <TextInput placeholder={shopContent?.searchPlaceholder || 'T-shirts, Jackets, Earbuds...'} className="flex-1 text-black text-sm" />
          <Pressable onPress={() => router.push('/search')}>
            <Text className="text-black font-bold text-sm">Go</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}>
        {(shopContent?.filterChips || ['All', 'Relevance', 'Price', 'Newest', 'Rating', 'Best Sellers']).map((item: string, index: number) => (
          <Pressable key={item} className={`h-9 px-4 rounded-full justify-center ${index === 0 ? 'bg-black' : 'bg-[#F5F5F5]'}`}>
            <Text className={`text-sm font-bold ${index === 0 ? 'text-white' : 'text-gray-600'}`}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeading title={shopContent?.categoriesHeading || 'Categories'} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        {categories.map((item: any) => (
          <Pressable key={item.id} onPress={() => router.push(`/category/${item.slug}`)} className="h-10 px-4 rounded-full bg-[#F5F5F5] justify-center">
            <Text className="text-sm font-bold text-black">{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeading title={`${products.length} ${shopContent?.countSuffix || 'Products'}`} />
      <View className="px-4 flex-row flex-wrap justify-between">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    </Screen>
  );
}
