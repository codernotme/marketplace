import '../global.css';

import type { ReactNode } from 'react';
import { HeroUINativeProvider } from 'heroui-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AppProvider } from '@/context/app-context';

const HeroProvider = HeroUINativeProvider as any;

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1 }}>
        <HeroProvider>
          <AppProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="products/[slug]" />
              <Stack.Screen name="category/[slug]" />
              <Stack.Screen name="search" />
              <Stack.Screen name="wishlist" />
              <Stack.Screen name="track" />
              <Stack.Screen name="checkout" />
              <Stack.Screen name="checkout/success" />
              <Stack.Screen name="blog/[slug]" />
              <Stack.Screen name="contact" />
              <Stack.Screen name="faq" />
              <Stack.Screen name="privacy" />
              <Stack.Screen name="refund" />
              <Stack.Screen name="terms" />
              <Stack.Screen name="about" />
              <Stack.Screen name="account" />
              <Stack.Screen name="account/orders" />
              <Stack.Screen name="account/orders/[id]" />
              <Stack.Screen name="account/profile" />
              <Stack.Screen name="account/addresses" />
              <Stack.Screen name="account/notifications" />
            </Stack>
            <StatusBar style="auto" />
          </AppProvider>
        </HeroProvider>
      </View>
    </GestureHandlerRootView>
  );
}
