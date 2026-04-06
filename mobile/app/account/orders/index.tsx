// @ts-nocheck
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState, Screen, SiteHeader } from '@/components/storefront';
import { fetchCustomerOrders } from '@/lib/api';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomerOrders().then(setOrders);
  }, []);

  return (
    <Screen>
      <SiteHeader title="Order History" subtitle="My orders" />

      <View className="px-4 mt-2">
        {orders.length === 0 ? (
          <EmptyState icon="package-variant-closed" title="No orders found" message="Looks like you haven&apos;t placed any orders yet." actionHref="/shop" actionLabel="Continue shopping" />
        ) : (
          <View className="gap-4">
            {orders.map((order) => (
              <View key={order.id} className="bg-white border border-[#F0F0F0] rounded-3xl p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-black text-black text-base">{order.orderNumber}</Text>
                  <Text className="text-xs font-bold uppercase bg-[#F5F5F5] px-3 py-1 rounded-full">{order.fulfillmentStatus.replaceAll('_', ' ')}</Text>
                </View>
                <Text className="text-gray-500 text-xs mb-2">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="font-black text-black text-lg">${order.pricing.grandTotal.toFixed(2)}</Text>
                  <Pressable onPress={() => router.push(`/account/orders/${order.id}`)} className="h-9 px-4 rounded-full border border-gray-200 justify-center">
                    <Text className="text-black font-bold text-sm">Details</Text>
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
