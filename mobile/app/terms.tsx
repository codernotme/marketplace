import { Text, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';

export default function TermsScreen() {
  return (
    <Screen>
      <SiteHeader title="Terms of Service" subtitle="Legal" />
      <View className="px-4 gap-4 pb-8">
        <Text className="text-black leading-7">By using the store you agree to standard commerce terms, product availability, and order processing rules.</Text>
        <Text className="text-black leading-7">All product content, images, and mock checkout interactions are provided for demonstration inside this Expo clone.</Text>
      </View>
    </Screen>
  );
}
