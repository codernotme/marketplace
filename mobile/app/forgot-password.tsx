import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, FieldError, Input, Label, TextField } from 'heroui-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const content = storefrontContent.auth.forgotPassword;
  const isEmailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-4 pb-8">
        {!sent ? (
          <>
            <TextField isRequired isInvalid={isEmailInvalid}>
              <Label>{content.emailPlaceholder}</Label>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder={content.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FieldError>Please enter a valid email address.</FieldError>
            </TextField>

            <Button variant="primary" onPress={() => setSent(true)}>
              <Button.Label>{content.submitLabel}</Button.Label>
            </Button>
          </>
        ) : (
          <View className="rounded-3xl bg-white border border-[#EFEFEF] p-4 gap-2">
            <Text className="text-black font-black text-lg">{content.successTitle}</Text>
            <Text className="text-gray-600">{content.successDescription}</Text>
          </View>
        )}

        <Button variant="outline" onPress={() => router.push('/login')}>
          <Button.Label>{content.secondaryLabel}</Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
