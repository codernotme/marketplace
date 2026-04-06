// @ts-nocheck
import React from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Screen, SiteHeader } from '@/components/storefront';
import { useAppContext } from '@/context/app-context';
import { fetchStorefrontContent } from '@/lib/api';

export default function AccountScreen() {
  const { useEffect, useState } = React as any;
  const { wishlistIds, cartCount } = useAppContext();
  const [content, setContent] = useState(null as any);

  useEffect(() => {
    fetchStorefrontContent().then(setContent);
  }, []);

  const accountContent = content?.account;
  const shortcuts = accountContent?.shortcuts || [];

  return (
    <Screen>
      <SiteHeader title={accountContent?.title || 'Account Hub'} subtitle={accountContent?.subtitle || 'My account'} />

      <View className="px-4 mb-4 flex-row flex-wrap justify-between">
        {(accountContent?.stats || []).map((item: any) => (
          <View key={item.label} className="w-[48%] mb-3 rounded-3xl bg-[#F5F5F5] p-4">
            <Text className="text-xs uppercase tracking-[2px] text-gray-500 font-bold mb-1">{item.label}</Text>
            <Text className="text-2xl font-black text-black">
              {item.source === 'wishlist' ? String(wishlistIds.length) : item.source === 'cart' ? String(cartCount) : item.value}
            </Text>
          </View>
        ))}
      </View>

      <View className="px-4 gap-3">
        {shortcuts.map((item) => (
          <Pressable key={item.href} onPress={() => router.push(item.href)} className="h-14 rounded-2xl bg-white border border-[#F0F0F0] px-4 flex-row items-center justify-between">
            <Text className="text-black font-bold">{item.label}</Text>
            <Text className="text-gray-400">›</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
