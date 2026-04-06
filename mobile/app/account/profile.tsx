// @ts-nocheck
import { Text, View } from 'react-native';
import { Button, Input, Label, TextField } from 'heroui-native';
import { Screen, SiteHeader } from '@/components/storefront';

export default function ProfileScreen() {
  return (
    <Screen>
      <SiteHeader title="Profile" subtitle="Settings" />
      <View className="px-4 gap-4 mt-2">
        {['First name', 'Last name', 'Email', 'Phone', 'City', 'Country'].map((label, index) => (
          <TextField key={label}>
            <Label>{label}</Label>
            <Input defaultValue={['Ava', 'Sterling', 'ava@example.com', '+1 555 010 7788', 'San Francisco', 'United States'][index]} />
          </TextField>
        ))}
        <Button variant="primary" className="mt-2" onPress={() => undefined}>
          <Button.Label>Save Changes</Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
