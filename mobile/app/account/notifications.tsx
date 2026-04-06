// @ts-nocheck
import { Text, View, Switch } from 'react-native';
import { useEffect, useState } from 'react';

import { Screen, SiteHeader } from '@/components/storefront';
import { fetchNotifications } from '@/lib/api';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [prefs, setPrefs] = useState({ orderUpdates: true, promotions: true, wishlistDrops: true, newsletter: false });

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  return (
    <Screen>
      <SiteHeader title="Notifications" subtitle="Alerts" />
      <View className="px-4 gap-4 mt-2">
        <View className="bg-white border border-[#F0F0F0] rounded-3xl p-4 gap-3">
          {notifications.map((item) => (
            <View key={item.id} className="rounded-2xl bg-[#F5F5F5] p-4">
              <Text className="text-black font-bold">{item.title}</Text>
              <Text className="text-gray-600 text-xs mt-2">{item.body}</Text>
            </View>
          ))}
        </View>

        <View className="bg-white border border-[#F0F0F0] rounded-3xl p-4 gap-3">
          {[
            ['orderUpdates', 'Order updates', 'Shipping and delivery alerts'],
            ['promotions', 'Promotions', 'Sales and limited-time offers'],
            ['wishlistDrops', 'Wishlist price drops', 'When saved items drop in price'],
            ['newsletter', 'Weekly newsletter', 'Style guides and product stories'],
          ].map(([key, label, sub]) => (
            <View key={key} className="flex-row items-center justify-between gap-4 py-2">
              <View className="flex-1 pr-3">
                <Text className="text-black font-bold">{label}</Text>
                <Text className="text-gray-500 text-xs mt-1">{sub}</Text>
              </View>
              <Switch value={prefs[key as keyof typeof prefs]} onValueChange={(value) => setPrefs((current) => ({ ...current, [key]: value }))} />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
