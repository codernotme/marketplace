// @ts-nocheck
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

import { EmptyState, ProductCard, Screen, SiteHeader } from '@/components/storefront';
import { fetchProducts } from '@/lib/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([] as any[]);

  useEffect(() => {
    fetchProducts().then((items) => {
      const lowered = query.trim().toLowerCase();
      setResults(
        !lowered
          ? items
          : items.filter((item: any) => [item.title, item.brand, item.description, ...(item.tags || [])].join(' ').toLowerCase().includes(lowered)),
      );
    });
  }, [query]);

  return (
    <Screen>
      <SiteHeader title="Find Products" subtitle="Search" />

      <View className="px-4 mt-2 mb-4">
        <View className="flex-row items-center gap-3 bg-[#F5F5F5] rounded-2xl px-4 h-14">
          <MaterialCommunityIcons name="magnify" size={18} color="#9CA3AF" />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search by product, brand, or tag" className="flex-1 text-black text-sm" />
        </View>
      </View>

      {!query ? (
        <View className="px-4">
          <EmptyState
            icon="magnify"
            title="Start typing to search"
            message="Search the catalogue by product name, brand, or tag."
            actionHref="/shop"
            actionLabel="Browse products"
          />
        </View>
      ) : (
        <View className="px-4 flex-row flex-wrap justify-between">
          {results.length > 0 ? results.map((product) => <ProductCard key={product.id} product={product} />) : (
            <View className="w-full">
              <EmptyState
                icon="database-search-outline"
                title="No matching products"
                message="Try another keyword or browse all categories."
                actionHref="/shop"
                actionLabel="Browse products"
              />
            </View>
          )}
        </View>
      )}
    </Screen>
  );
}
