import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function CheckoutSuccessScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="w-20 h-20 rounded-full bg-[#84D347]/15 items-center justify-center mb-6">
        <Ionicons name="checkmark" size={36} color="#84D347" />
      </View>
      <Text className="text-black font-black text-3xl text-center">Order placed</Text>
      <Text className="text-gray-600 text-center mt-3 mb-8 leading-6">Your order has been submitted successfully. You can track it from the account section or continue shopping now.</Text>
      <Pressable onPress={() => router.replace('/(tabs)')} className="w-full h-12 rounded-full bg-black items-center justify-center mb-3">
        <Text className="text-white font-bold">Continue Shopping</Text>
      </Pressable>
      <Pressable onPress={() => router.replace('/account/orders')} className="w-full h-12 rounded-full bg-[#F5F5F5] items-center justify-center">
        <Text className="text-black font-bold">View Orders</Text>
      </Pressable>
    </View>
  );
}
