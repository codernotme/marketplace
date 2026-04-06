import { Text, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function PrivacyScreen() {
  const content = storefrontContent.legal.privacy;

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-4 pb-8">
        {content.paragraphs.map((paragraph) => (
          <Text key={paragraph} className="text-black leading-7">{paragraph}</Text>
        ))}
      </View>
    </Screen>
  );
}
