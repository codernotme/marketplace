// @ts-nocheck
import { Text, View, Pressable } from 'react-native';

import { Screen, SiteHeader } from '@/components/storefront';
import { fetchCustomerAddresses } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomerAddresses().then(setAddresses);
  }, []);

  return (
    <Screen>
      <SiteHeader title="Saved Addresses" subtitle="Addresses" />
      <View className="px-4 gap-4 mt-2">
        {addresses.map((address) => (
          <View key={address.id} className="bg-white border border-[#F0F0F0] rounded-3xl p-4">
            <Text className="text-black font-black text-lg mb-1">{address.label}</Text>
            <Text className="text-gray-600 text-sm leading-5">{address.line1}{address.line2 ? `, ${address.line2}` : ''}{'\n'}{address.city}, {address.state} {address.pincode}{'\n'}{address.country}</Text>
            <View className="flex-row justify-between mt-4 pt-3 border-t border-gray-100">
              <Text className="text-gray-500 text-sm">{address.phone}</Text>
              {address.isDefault ? <Text className="text-[#84D347] text-sm font-bold">Default</Text> : <Pressable><Text className="text-black text-sm font-bold">Set default</Text></Pressable>}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
