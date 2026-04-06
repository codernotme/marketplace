import { Text, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function FaqScreen() {
  const content = storefrontContent.faq;

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-3 pb-8">
        {content.items.map(([question, answer]) => (
          <View key={question} className="bg-white border border-[#F0F0F0] rounded-3xl p-4">
            <Text className="text-black font-black text-base mb-2">{question}</Text>
            <Text className="text-gray-600 leading-6">{answer}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
