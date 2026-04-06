// @ts-nocheck
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Input, Label, TextField } from 'heroui-native';

import { EmptyState, Screen, SiteHeader } from '@/components/storefront';
import { fetchTrackOrder } from '@/lib/api';

export default function TrackOrderScreen() {
  const [orderNumber, setOrderNumber] = useState('MKT-2026-00114');
  const [email, setEmail] = useState('ava@example.com');
  const [order, setOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const lookup = async () => {
    setOrder(await fetchTrackOrder(orderNumber, email));
    setSearched(true);
  };

  return (
    <Screen>
      <SiteHeader title="Track Order" subtitle="Public tracking" />
      <ScrollView className="px-4" contentContainerClassName="pb-8 gap-4">
        <View className="bg-white border border-[#F0F0F0] rounded-3xl p-4 gap-4">
          <TextField>
            <Label>Order number</Label>
            <Input value={orderNumber} onChangeText={setOrderNumber} placeholder="Order number" autoCapitalize="characters" />
          </TextField>
          <TextField>
            <Label>Email address</Label>
            <Input value={email} onChangeText={setEmail} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" />
          </TextField>
          <Button variant="primary" onPress={lookup}>
            <Button.Label>Track Order</Button.Label>
          </Button>
        </View>

        {searched && !order ? (
          <EmptyState icon="package-search" title="No order found" message="Check the order number and email address, then try again." />
        ) : null}

        {order ? (
          <View className="bg-[#F5F5F5] rounded-3xl p-4 gap-3">
            <Text className="text-black font-black text-2xl">{order.orderNumber}</Text>
            <Text className="text-gray-600 text-sm">Courier: {order.courier}</Text>
            <Text className="text-gray-600 text-sm">Tracking: {order.trackingNumber}</Text>
            <View className="pt-2 gap-3">
              {order.timeline.map((event: any) => (
                <View key={event.status + event.createdAt} className="flex-row gap-3">
                  <View className="w-7 h-7 rounded-full bg-black" />
                  <View className="flex-1">
                    <Text className="text-black font-bold uppercase text-xs">{event.status.replaceAll('_', ' ')}</Text>
                    <Text className="text-gray-600 text-sm mt-1">{event.note}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
