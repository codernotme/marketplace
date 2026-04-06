import { useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false);
  const content = storefrontContent.auth.forgotPassword;

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-4 pb-8">
        {!sent ? (
          <>
            <TextInput placeholder={content.emailPlaceholder} className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
            <Pressable className="h-12 rounded-full bg-black items-center justify-center" onPress={() => setSent(true)}>
              <Text className="text-white font-bold">{content.submitLabel}</Text>
            </Pressable>
          </>
        ) : (
          <View className="rounded-3xl bg-white border border-[#EFEFEF] p-4 gap-2">
            <Text className="text-black font-black text-lg">{content.successTitle}</Text>
            <Text className="text-gray-600">{content.successDescription}</Text>
          </View>
        )}
        <Link href="/login" asChild>
          <Pressable className="h-11 rounded-full border border-[#D9D9D9] items-center justify-center">
            <Text className="text-black font-bold">{content.secondaryLabel}</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
