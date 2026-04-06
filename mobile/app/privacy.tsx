import { Text, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';

export default function PrivacyScreen() {
  return (
    <Screen>
      <SiteHeader title="Privacy Policy" subtitle="Legal" />
      <View className="px-4 gap-4 pb-8">
        <Text className="text-black leading-7">We only use the data needed to process orders, support accounts, and improve the storefront experience.</Text>
        <Text className="text-black leading-7">This mobile clone uses local mock data only. No external personal data is transmitted from these screens.</Text>
      </View>
    </Screen>
  );
}
