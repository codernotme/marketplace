import { Text, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';

const faqs = [
  ['How long does shipping take?', 'Standard shipping usually takes 3-5 business days depending on location.'],
  ['Can I return an item?', 'Yes, returns are accepted within the return window as long as the product is unused.'],
  ['How do I track my order?', 'Use the Track Order page with your order number and email address.'],
];

export default function FaqScreen() {
  return (
    <Screen>
      <SiteHeader title="FAQ" subtitle="Help" />
      <View className="px-4 gap-3 pb-8">
        {faqs.map(([question, answer]) => (
          <View key={question} className="bg-white border border-[#F0F0F0] rounded-3xl p-4">
            <Text className="text-black font-black text-base mb-2">{question}</Text>
            <Text className="text-gray-600 leading-6">{answer}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
