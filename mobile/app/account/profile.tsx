// @ts-nocheck
import { Text, TextInput, View, Pressable } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';

export default function ProfileScreen() {
  return (
    <Screen>
      <SiteHeader title="Profile" subtitle="Settings" />
      <View className="px-4 gap-4 mt-2">
        {['First name', 'Last name', 'Email', 'Phone', 'City', 'Country'].map((label, index) => (
          <View key={label}>
            <Text className="text-sm font-bold text-black mb-2">{label}</Text>
            <TextInput defaultValue={['Ava', 'Sterling', 'ava@example.com', '+1 555 010 7788', 'San Francisco', 'United States'][index]} className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
          </View>
        ))}
        <Pressable className="h-12 rounded-full bg-black items-center justify-center mt-2">
          <Text className="text-white font-bold">Save Changes</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
