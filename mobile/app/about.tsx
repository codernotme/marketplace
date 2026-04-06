import { Text, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';

export default function AboutScreen() {
  return (
    <Screen>
      <SiteHeader title="About Us" subtitle="Company" />
      <View className="px-4 gap-4 pb-8">
        <Text className="text-black leading-7">We build curated ecommerce experiences focused on quality products, clear discovery, and a fast checkout flow.</Text>
        <Text className="text-black leading-7">The mobile app mirrors the storefront catalogue, account journeys, and content sections so customers can move between web and app without losing context.</Text>
      </View>
    </Screen>
  );
}
