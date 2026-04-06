// @ts-nocheck
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Screen, SectionHeading, SiteHeader } from '@/components/storefront';
import { fetchCustomerOrders, fetchNotifications } from '@/lib/api';
import { router } from 'expo-router';

export default function AccountOverviewScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomerOrders().then(setOrders);
    fetchNotifications().then(setNotifications);
  }, []);

  return (
    <Screen>
      <SiteHeader title="Account Overview" subtitle="My account" />

      <View className="px-4 flex-row flex-wrap justify-between mb-2">
        {[
          { label: 'Total Orders', value: String(orders.length) },
          { label: 'Unread Alerts', value: String(notifications.filter((item) => !item.read).length) },
          { label: 'Saved Addresses', value: '2' },
          { label: 'Wishlist Items', value: '4' },
        ].map((item) => (
          <View key={item.label} className="w-[48%] mb-3 rounded-3xl bg-[#F5F5F5] p-4">
            <Text className="text-xs uppercase tracking-[2px] text-gray-500 font-bold mb-1">{item.label}</Text>
            <Text className="text-2xl font-black text-black">{item.value}</Text>
          </View>
        ))}
      </View>

      <SectionHeading title="Quick Links" />
      <View className="px-4 gap-3">
        {[
          { label: 'My Orders', href: '/account/orders' },
          { label: 'Addresses', href: '/account/addresses' },
          { label: 'Wishlist', href: '/wishlist' },
          { label: 'Notifications', href: '/account/notifications' },
          { label: 'Profile', href: '/account/profile' },
          { label: 'Track Order', href: '/track' },
        ].map((item) => (
          <Pressable key={item.href} onPress={() => router.push(item.href)} className="h-14 rounded-2xl bg-white border border-[#F0F0F0] px-4 flex-row items-center justify-between">
            <Text className="text-black font-bold">{item.label}</Text>
            <Text className="text-gray-400">›</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
