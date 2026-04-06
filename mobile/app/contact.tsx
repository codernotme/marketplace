import { Text, TextInput, Pressable, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function ContactScreen() {
  const content = storefrontContent.contact;

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-4 pb-8">
        <TextInput placeholder={content.fields.name.placeholder} className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
        <TextInput placeholder={content.fields.email.placeholder} className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
        <TextInput placeholder={content.fields.message.placeholder} multiline className="h-32 rounded-3xl bg-[#F5F5F5] px-4 pt-4 text-black" />
        <Pressable className="h-12 rounded-full bg-black items-center justify-center"><Text className="text-white font-bold">{content.submitLabel}</Text></Pressable>
      </View>
    </Screen>
  );
}
