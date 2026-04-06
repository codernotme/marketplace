// @ts-nocheck
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from 'heroui-native';

import { EmptyState, Screen, SiteHeader } from '@/components/storefront';
// @ts-nocheck
import { useAppContext } from '@/context/app-context';

export default function CartScreen() {
  const { cartItems, updateQuantity, removeFromCart } = useAppContext();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <Screen>
      <SiteHeader title="Shopping Cart" subtitle="Cart" />

      <View className="px-4 mt-2">
        {cartItems.length === 0 ? (
          <EmptyState
            icon="cart-outline"
            title="Your cart is empty"
            message="Looks like you haven't added anything yet."
            actionHref="/shop"
            actionLabel="Start Shopping"
          />
        ) : (
          <View className="gap-4">
            {cartItems.map((item) => (
              <View key={item.id} className="flex-row gap-4 items-center p-4 rounded-3xl border border-[#F0F0F0] bg-white">
                <View className="w-20 h-20 rounded-2xl bg-[#F5F5F5] overflow-hidden" />
                <View className="flex-1 min-w-0">
                  <Text className="text-black font-bold text-base" numberOfLines={1}>{item.title}</Text>
                  <Text className="text-gray-500 text-xs mt-1">{item.variantLabel}</Text>
                  <Text className="text-black font-black mt-2">${item.price}</Text>
                </View>
                <View className="items-end gap-2">
                  <View className="flex-row items-center rounded-full bg-[#F5F5F5] p-1">
                    <Button variant="secondary" size="sm" onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Button.Label>-</Button.Label>
                    </Button>
                    <Text className="w-8 text-center font-bold text-black">{item.quantity}</Text>
                    <Button variant="secondary" size="sm" onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Button.Label>+</Button.Label>
                    </Button>
                  </View>
                  <Button variant="tertiary" size="sm" onPress={() => removeFromCart(item.id)}>
                    <Button.Label>
                      <MaterialCommunityIcons name="close" size={18} color="#9CA3AF" />
                    </Button.Label>
                  </Button>
                </View>
              </View>
            ))}

            <View className="rounded-3xl bg-[#F5F5F5] p-5 mt-2">
              <Text className="text-2xl font-black text-black mb-4">Order Summary</Text>
              <View className="gap-3 border-b border-gray-200 pb-4 mb-4">
                <View className="flex-row justify-between"><Text className="text-gray-600">Subtotal</Text><Text className="text-black font-bold">${subtotal.toFixed(2)}</Text></View>
                <View className="flex-row justify-between"><Text className="text-gray-600">Shipping</Text><Text className="text-black font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Text></View>
              </View>
              <View className="flex-row justify-between items-center mb-5"><Text className="text-black text-lg font-black">Total</Text><Text className="text-black text-2xl font-black">${total.toFixed(2)}</Text></View>
              <Button variant="primary" onPress={() => router.push('/checkout')}>
                <Button.Label>Proceed to Checkout</Button.Label>
              </Button>
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}
