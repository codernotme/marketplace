import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useAppContext } from '@/context/app-context';

export default function TabLayout() {
  const { cartCount } = useAppContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111111',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          borderTopColor: '#ECECEC',
          backgroundColor: '#FFFFFF',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <MaterialCommunityIcons name="home-outline" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <MaterialCommunityIcons name="store-outline" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <MaterialCommunityIcons name="cart-outline" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <MaterialCommunityIcons name="account-outline" size={size ?? 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
