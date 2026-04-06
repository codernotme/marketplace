import React from 'react';
import { router } from 'expo-router';
import { Text, View, ScrollView } from 'react-native';
import { Button, Input } from 'heroui-native';

import { BrandLoader } from '@/components/brand-loader';
import { ProductCard, Screen, SectionHeading, SiteHeader } from '@/components/storefront';
import { fetchCategories, fetchProducts, fetchStorefrontContent } from '@/lib/api';

export default function ShopScreen() {
  const { useEffect, useState } = React as any;
  const [products, setProducts] = useState([] as any[]);
  const [categories, setCategories] = useState([] as any[]);
  const [content, setContent] = useState(null as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchStorefrontContent()]).then(([loadedProducts, loadedCategories, loadedContent]) => {
      setProducts(loadedProducts);
      setCategories(loadedCategories);
      setContent(loadedContent);
      setLoading(false);
    });
  }, []);

  const shopContent = content?.shop;

  if (loading) {
    return <BrandLoader subtitle="Loading catalogue" />;
  }

  return (
    <Screen>
      <SiteHeader title={shopContent?.title || 'Full Catalogue'} subtitle={shopContent?.subtitle || 'Browse'} />

      <View className="px-4 mb-4">
        <View className="flex-row items-center gap-3">
          <Text className="text-gray-400">{shopContent?.searchLeadingLabel || 'Search'}</Text>
          <Input
            className="flex-1"
            placeholder={shopContent?.searchPlaceholder || 'T-shirts, Jackets, Earbuds...'}
            placeholderColorClassName="field-placeholder"
          />
          <Button variant="secondary" size="sm" onPress={() => router.push('/search')}>
            <Button.Label>Go</Button.Label>
          </Button>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}>
        {(shopContent?.filterChips || ['All', 'Relevance', 'Price', 'Newest', 'Rating', 'Best Sellers']).map((item: string, index: number) => (
          <Button key={item} variant={index === 0 ? 'primary' : 'secondary'} size="sm">
            <Button.Label>{item}</Button.Label>
          </Button>
        ))}
      </ScrollView>

      <SectionHeading title={shopContent?.categoriesHeading || 'Categories'} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        {categories.map((item: any) => (
          <Button key={item.id} variant="secondary" size="sm" onPress={() => router.push(`/category/${item.slug}`)}>
            <Button.Label>{item.name}</Button.Label>
          </Button>
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
