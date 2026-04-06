import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, FieldError, Input, Label, TextField } from 'heroui-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function RegisterScreen() {
  const content = storefrontContent.auth.register;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isEmailInvalid = useMemo(() => email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const isPasswordInvalid = useMemo(() => password.length > 0 && password.length < 6, [password]);

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-4 pb-8">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TextField isRequired>
              <Label>{content.firstNamePlaceholder}</Label>
              <Input value={firstName} onChangeText={setFirstName} placeholder={content.firstNamePlaceholder} />
            </TextField>
          </View>
          <View className="flex-1">
            <TextField isRequired>
              <Label>{content.lastNamePlaceholder}</Label>
              <Input value={lastName} onChangeText={setLastName} placeholder={content.lastNamePlaceholder} />
            </TextField>
          </View>
        </View>

        <TextField isRequired isInvalid={isEmailInvalid}>
          <Label>{content.emailPlaceholder}</Label>
          <Input value={email} onChangeText={setEmail} placeholder={content.emailPlaceholder} keyboardType="email-address" autoCapitalize="none" />
          <FieldError>Please enter a valid email address.</FieldError>
        </TextField>

        <TextField isRequired isInvalid={isPasswordInvalid}>
          <Label>{content.passwordPlaceholder}</Label>
          <Input value={password} onChangeText={setPassword} placeholder={content.passwordPlaceholder} secureTextEntry />
          <FieldError>Password must be at least 6 characters.</FieldError>
        </TextField>

        <Button variant="primary" onPress={() => undefined}>
          <Button.Label>{content.submitLabel}</Button.Label>
        </Button>

        <Button variant="outline" onPress={() => router.push('/login')}>
          <Button.Label>{content.secondaryLabel}</Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
