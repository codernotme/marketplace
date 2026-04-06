import '../global.css';

import type { HeroUINativeConfig } from 'heroui-native';
import { HeroUINativeProvider } from 'heroui-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AppProvider } from '@/context/app-context';

const HeroProvider = HeroUINativeProvider as any;

const heroConfig: HeroUINativeConfig = {
  textProps: {
    maxFontSizeMultiplier: 1.5,
    allowFontScaling: true,
  },
  devInfo: {
    stylingPrinciples: false,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <HeroProvider config={heroConfig}>
          <AppProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="auto" />
          </AppProvider>
        </HeroProvider>
      </View>
    </GestureHandlerRootView>
  );
}
