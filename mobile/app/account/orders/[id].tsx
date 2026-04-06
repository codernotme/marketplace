// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/storefront';
import { fetchCustomerOrderById } from '@/lib/api';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerOrderById(String(id)).then((item) => {
      setOrder(item || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white"><ActivityIndicator color="#111" /></View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#D1D5DB" />
        <Text className="text-black font-black text-2xl mt-4 mb-2">Order not found</Text>
        <Pressable onPress={() => router.back()} className="h-11 px-5 rounded-full bg-black items-center justify-center">
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Screen>
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center">
          <Ionicons name="arrow-back" size={18} color="#111" />
        </Pressable>
        <Text className="text-black font-black text-lg">{order.orderNumber}</Text>
        <View className="w-10 h-10" />
      </View>

      <View className="px-4 gap-4">
        <View className="rounded-3xl bg-[#F5F5F5] p-4">
          <Text className="text-black font-black text-2xl mb-3">Order Summary</Text>
          {order.items.map((item: any) => (
            <View key={item.id} className="flex-row items-center gap-3 mb-3">
              <View className="w-14 h-14 rounded-2xl bg-white" />
              <View className="flex-1">
                <Text className="text-black font-bold" numberOfLines={1}>{item.title}</Text>
                <Text className="text-gray-500 text-xs mt-1">{item.variantLabel} • Qty {item.quantity}</Text>
              </View>
              <Text className="font-black text-black">${item.subtotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-3xl bg-white border border-[#F0F0F0] p-4">
          <Text className="text-black font-black text-2xl mb-3">Tracking Timeline</Text>
          {order.timeline.map((event: any) => (
            <View key={event.status + event.createdAt} className="mb-3 flex-row gap-3">
              <View className="w-7 h-7 rounded-full bg-black items-center justify-center"><Ionicons name="checkmark" size={12} color="white" /></View>
              <View className="flex-1">
                <Text className="text-black font-bold uppercase text-xs">{event.status.replaceAll('_', ' ')}</Text>
                <Text className="text-gray-600 text-sm mt-1">{event.note}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
