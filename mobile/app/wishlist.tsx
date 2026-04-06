// @ts-nocheck
import { Pressable, Text, View } from 'react-native';

import { EmptyState, Screen, SiteHeader } from '@/components/storefront';
// @ts-nocheck
import { useAppContext } from '@/context/app-context';
import { fetchProducts } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function WishlistScreen() {
  const { wishlistIds, toggleWishlist } = useAppContext();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const wishlistItems = products.filter((item) => wishlistIds.includes(item.id));

  return (
    <Screen>
      <SiteHeader title="My Wishlist" subtitle="Saved" />

      <View className="px-4 mt-2">
        {wishlistItems.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title="Your wishlist is empty"
            message="Tap the heart icon on any product to save it here."
            actionHref="/shop"
            actionLabel="Discover products"
          />
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {wishlistItems.map((product) => (
              <View key={product.id} className="w-full mb-4">
                <View className="flex-row items-center gap-3 p-4 rounded-3xl bg-white border border-[#F0F0F0]">
                  <View className="w-16 h-16 rounded-2xl bg-[#F5F5F5]" />
                  <View className="flex-1">
                    <Text className="text-black font-bold" numberOfLines={1}>{product.title}</Text>
                    <Text className="text-gray-500 text-xs mt-1">{product.brand}</Text>
                    <Text className="text-black font-black mt-2">${product.price}</Text>
                  </View>
                  <Pressable onPress={() => toggleWishlist(product.id)}>
                    <Text className="text-red-500 font-bold text-sm">Remove</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
