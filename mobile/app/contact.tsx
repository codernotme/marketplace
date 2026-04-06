import { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Label, TextField } from 'heroui-native';
import { Screen, SiteHeader } from '@/components/storefront';
import { storefrontContent } from '@/data/mock';

export default function ContactScreen() {
  const content = storefrontContent.contact;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Screen>
      <SiteHeader title={content.headerTitle} subtitle={content.headerSubtitle} />
      <View className="px-4 gap-4 pb-8">
        <TextField>
          <Label>{content.fields.name.placeholder}</Label>
          <Input value={name} onChangeText={setName} placeholder={content.fields.name.placeholder} />
        </TextField>

        <TextField>
          <Label>{content.fields.email.placeholder}</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder={content.fields.email.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </TextField>

        <TextField>
          <Label>{content.fields.message.placeholder}</Label>
          <Input
            value={message}
            onChangeText={setMessage}
            placeholder={content.fields.message.placeholder}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </TextField>

        <Button variant="primary" onPress={() => undefined}>
          <Button.Label>{content.submitLabel}</Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
