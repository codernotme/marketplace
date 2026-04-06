import { Text, TextInput, Pressable, View } from 'react-native';
import { Screen, SiteHeader } from '@/components/storefront';

export default function ContactScreen() {
  return (
    <Screen>
      <SiteHeader title="Contact" subtitle="Support" />
      <View className="px-4 gap-4 pb-8">
        <TextInput placeholder="Name" className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
        <TextInput placeholder="Email" className="h-12 rounded-2xl bg-[#F5F5F5] px-4 text-black" />
        <TextInput placeholder="Message" multiline className="h-32 rounded-3xl bg-[#F5F5F5] px-4 pt-4 text-black" />
        <Pressable className="h-12 rounded-full bg-black items-center justify-center"><Text className="text-white font-bold">Send Message</Text></Pressable>
      </View>
    </Screen>
  );
}
