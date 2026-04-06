import { Link } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function RegisterScreen() {
  const content = storefrontContent.auth.register;

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-4 pb-8">
        <View className="flex-row gap-3">
          <TextInput placeholder={content.firstNamePlaceholder} className="h-12 flex-1 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
          <TextInput placeholder={content.lastNamePlaceholder} className="h-12 flex-1 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
        </View>
        <TextInput placeholder={content.emailPlaceholder} className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
        <TextInput placeholder={content.passwordPlaceholder} secureTextEntry className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
        <Pressable className="h-12 rounded-full bg-black items-center justify-center">
          <Text className="text-white font-bold">{content.submitLabel}</Text>
        </Pressable>
        <Link href="/login" asChild>
          <Pressable className="h-11 rounded-full border border-[#D9D9D9] items-center justify-center">
            <Text className="text-black font-bold">{content.secondaryLabel}</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
