import { Text, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';

export default function RefundScreen() {
  return (
    <Screen>
      <SiteHeader title="Refund Policy" subtitle="Legal" />
      <View className="px-4 gap-4 pb-8">
        <Text className="text-black leading-7">Refunds are reviewed once a return is received and inspected.</Text>
        <Text className="text-black leading-7">Approved refunds are issued back to the original payment method after processing.</Text>
      </View>
    </Screen>
  );
}
