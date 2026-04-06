import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Description, FieldError, Input, Label, TextField } from 'heroui-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function LoginScreen() {
  const content = storefrontContent.auth.login;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isEmailInvalid = useMemo(() => email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const isPasswordInvalid = useMemo(() => password.length > 0 && password.length < 6, [password]);

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-4 pb-8">
        <TextField isRequired isInvalid={isEmailInvalid}>
          <Label>{content.emailPlaceholder}</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder={content.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Description>Use your account email to continue.</Description>
          <FieldError>Please enter a valid email address.</FieldError>
        </TextField>

        <TextField isRequired isInvalid={isPasswordInvalid}>
          <Label>{content.passwordPlaceholder}</Label>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder={content.passwordPlaceholder}
            secureTextEntry
          />
          <FieldError>Password must be at least 6 characters.</FieldError>
        </TextField>

        <Button className="mt-1" variant="primary" onPress={() => undefined}>
          <Button.Label>{content.submitLabel}</Button.Label>
        </Button>

        <Button variant="outline" onPress={() => router.push('/forgot-password')}>
          <Button.Label>{content.forgotLabel}</Button.Label>
        </Button>

        <Button variant="tertiary" onPress={() => router.push('/register')}>
          <Button.Label>{content.secondaryLabel}</Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
