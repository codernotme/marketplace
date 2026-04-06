import '../global.css';

import type { HeroUINativeConfig } from 'heroui-native';
import { HeroUINativeProvider } from 'heroui-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import 'react-native-reanimated';

import { AppProvider } from '@/context/app-context';
import { 
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold 
} from '@expo-google-fonts/cormorant-garamond';
import { 
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold 
} from '@expo-google-fonts/dm-sans';
import { 
  DMMono_400Regular,
  DMMono_500Medium 
} from '@expo-google-fonts/dm-mono';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
  const [loaded, error] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

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
