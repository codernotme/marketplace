import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from 'heroui-native';

export default function CheckoutSuccessScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="w-20 h-20 rounded-full bg-[#84D347]/15 items-center justify-center mb-6">
        <Ionicons name="checkmark" size={36} color="#84D347" />
      </View>
      <Text className="text-black font-black text-3xl text-center">Order placed</Text>
      <Text className="text-gray-600 text-center mt-3 mb-8 leading-6">Your order has been submitted successfully. You can track it from the account section or continue shopping now.</Text>
      <Button variant="primary" className="w-full mb-3" onPress={() => router.replace('/(tabs)')}>
        <Button.Label>Continue Shopping</Button.Label>
      </Button>
      <Button variant="outline" className="w-full" onPress={() => router.replace('/account/orders')}>
        <Button.Label>View Orders</Button.Label>
      </Button>
    </View>
  );
}
