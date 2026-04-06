// @ts-nocheck
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen, SiteHeader } from '@/components/storefront';
import { useAppContext } from '@/context/app-context';

export default function CheckoutScreen() {
  const { cartItems, cartTotal, clearCart } = useAppContext();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Ava Sterling');
  const [email, setEmail] = useState('ava@example.com');
  const [address, setAddress] = useState('123 Main Street, Apartment 4B');
  const [city, setCity] = useState('San Francisco');

  const shipping = cartTotal > 0 ? 0 : 0;
  const tax = Math.round(cartTotal * 0.08 * 100) / 100;
  const grandTotal = useMemo(() => cartTotal + shipping + tax, [cartTotal, shipping, tax]);

  const placeOrder = () => {
    clearCart();
    router.replace('/checkout/success');
  };

  return (
    <Screen>
      <SiteHeader title="Checkout" subtitle="Fast and secure" />
      <ScrollView className="px-4" contentContainerClassName="pb-8 gap-4">
        <View className="flex-row gap-2">
          {['Contact', 'Shipping', 'Payment'].map((label, index) => (
            <View key={label} className={`flex-1 rounded-full h-2 ${step >= index + 1 ? 'bg-black' : 'bg-[#E5E7EB]'}`} />
          ))}
        </View>

        <View className="bg-white border border-[#F0F0F0] rounded-3xl p-4 gap-4">
          <Text className="text-black font-black text-2xl">{step === 1 ? 'Contact details' : step === 2 ? 'Shipping address' : 'Payment method'}</Text>

          {step === 1 ? (
            <>
              <TextInput value={name} onChangeText={setName} placeholder="Full name" className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
              <TextInput value={email} onChangeText={setEmail} placeholder="Email address" keyboardType="email-address" className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
            </>
          ) : step === 2 ? (
            <>
              <TextInput value={address} onChangeText={setAddress} placeholder="Street address" className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
              <TextInput value={city} onChangeText={setCity} placeholder="City" className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
            </>
          ) : (
            <View className="rounded-2xl bg-[#F5F5F5] p-4 flex-row items-center gap-3">
              <Ionicons name="card-outline" size={24} color="#111" />
              <View className="flex-1">
                <Text className="text-black font-bold">Cash on delivery</Text>
                <Text className="text-gray-500 text-xs mt-1">Placeholder checkout for the mobile clone</Text>
              </View>
            </View>
          )}

          <View className="flex-row gap-3">
            {step > 1 ? <Pressable onPress={() => setStep((current) => current - 1)} className="flex-1 h-12 rounded-full border border-gray-200 items-center justify-center"><Text className="text-black font-bold">Back</Text></Pressable> : null}
            <Pressable onPress={() => (step < 3 ? setStep((current) => current + 1) : placeOrder())} className="flex-1 h-12 rounded-full bg-black items-center justify-center">
              <Text className="text-white font-bold">{step < 3 ? 'Continue' : 'Place Order'}</Text>
            </Pressable>
          </View>
        </View>

        <View className="bg-[#F5F5F5] rounded-3xl p-4 gap-3">
          <Text className="text-black font-black text-xl">Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.product.id + item.variant.id} className="flex-row justify-between">
              <Text className="text-black flex-1 pr-4">{item.product.title} x {item.quantity}</Text>
              <Text className="text-black font-bold">${item.lineTotal.toFixed(2)}</Text>
            </View>
          ))}
          <View className="h-px bg-gray-200 my-1" />
          <View className="flex-row justify-between"><Text className="text-gray-600">Subtotal</Text><Text className="text-black font-bold">${cartTotal.toFixed(2)}</Text></View>
          <View className="flex-row justify-between"><Text className="text-gray-600">Shipping</Text><Text className="text-black font-bold">${shipping.toFixed(2)}</Text></View>
          <View className="flex-row justify-between"><Text className="text-gray-600">Tax</Text><Text className="text-black font-bold">${tax.toFixed(2)}</Text></View>
          <View className="flex-row justify-between pt-2"><Text className="text-black font-black text-lg">Total</Text><Text className="text-black font-black text-lg">${grandTotal.toFixed(2)}</Text></View>
        </View>
      </ScrollView>
    </Screen>
  );
}
