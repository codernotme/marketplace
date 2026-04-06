import React, { useEffect } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, Text, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  cancelAnimation
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { storefrontContent } from '@/data/mock';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function Screen({ children, bg = "bg-white" }: { children: React.ReactNode; bg?: string }) {
  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SiteHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const brand = storefrontContent.brand;

  return (
    <View className="px-4 pt-2 pb-6">
      <View className="flex-row items-center justify-between mb-8">
        <Link href="/" className="flex-row items-center gap-2.5">
          <View className="w-10 h-10 rounded-2xl bg-black items-center justify-center overflow-hidden shadow-sm">
             <Image source={require('@/assets/images/logo.png')} className="w-full h-full" contentFit="cover" />
          </View>
          <Text className="text-black font-black text-xl tracking-tighter font-display uppercase">{brand.siteName}</Text>
        </Link>

        <View className="flex-row items-center gap-2.5">
          <Link href="/search" className="w-11 h-11 rounded-full bg-[#F5F5F5] border border-black/5 items-center justify-center">
            <Ionicons name="search-outline" size={20} color="#111" />
          </Link>
          <Link href="/wishlist" className="w-11 h-11 rounded-full bg-[#F5F5F5] border border-black/5 items-center justify-center">
            <Ionicons name="heart-outline" size={20} color="#111" />
          </Link>
        </View>
      </View>

      <View>
        <View className="flex-row items-center gap-2 mb-2">
           <View className="w-1.5 h-1.5 rounded-full bg-[#84D347]" />
           <Text className="text-[10px] font-black uppercase tracking-[3px] text-[#84D347] font-mono">{subtitle || brand.defaultHeaderSubtitle}</Text>
        </View>
        <Text className="text-4xl font-bold tracking-tight text-black font-display leading-[42px]">{title}</Text>
      </View>
    </View>
  );
}

export function SectionHeading({
  title,
  actionHref,
  actionLabel,
  eyebrow,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
  eyebrow?: string;
}) {
  return (
    <View className="flex-row items-end justify-between px-4 mb-6 mt-4">
      <View className="flex-1">
        {eyebrow ? (
          <Text className="text-[10px] font-black uppercase tracking-[3px] text-[#84D347] mb-1.5 font-mono">{eyebrow}</Text>
        ) : null}
        <Text className="text-3xl font-bold tracking-tight text-black font-display leading-none">{title}</Text>
      </View>
      {actionHref ? (
        <Link href={actionHref} className="pb-0.5">
          <View className="flex-row items-center gap-1 border-b border-gray-200">
            <Text className="text-xs font-bold text-gray-400 font-body lowercase tracking-tight">
              {actionLabel || 'See all'}
            </Text>
            <Ionicons name="chevron-forward" size={12} color="#9ca3af" />
          </View>
        </Link>
      ) : null}
    </View>
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: 'default' | 'success' }) {
  return (
    <View className={`px-2.5 py-1 rounded-full ${variant === 'success' ? 'bg-[#84D347]' : 'bg-white/90'} border border-black/5 shadow-sm`}>
      <Text className="text-[9px] font-black text-black font-mono uppercase tracking-wider">{children}</Text>
    </View>
  );
}

export function CategoryTile({ item }: { item: { id: string; slug: string; name: string; image: string; count: number } }) {
  return (
    <Pressable onPress={() => router.push(`/category/${item.slug}`)} className="w-[31%] aspect-square rounded-[24px] overflow-hidden bg-[#F5F5F5] mb-4">
      <Image source={{ uri: item.image }} className="absolute inset-0 w-full h-full" contentFit="cover" />
      <View className="absolute inset-0 bg-black/30" />
      <View className="absolute inset-0 p-3 justify-end items-center">
        <Text className="font-bold text-white text-xs text-center font-display" numberOfLines={1}>{item.name}</Text>
        <Text className="text-[9px] text-white/70 font-mono text-center mt-0.5 uppercase tracking-tighter">{item.count} items</Text>
      </View>
    </Pressable>
  );
}

export function ProductCard({ product }: { product: any }) {
  const image = product.images?.[0] || product.image || '';
  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <Pressable onPress={() => router.push(`/products/${product.slug}`)} className="w-[48%] mb-6">
      <View className="rounded-[28px] overflow-hidden bg-[#F5F5F5] border border-black/5">
        <View className="aspect-square bg-white relative">
          <Image source={{ uri: image }} className="w-full h-full" contentFit="cover" />
          <View className="absolute top-2.5 left-2.5 flex-row flex-wrap gap-1.5">
            {discount > 0 ? <Badge variant="success">{`-${discount}%`}</Badge> : null}
            {product.is_new ? <Badge>NEW</Badge> : null}
            {product.is_trending ? <Badge>TRENDING</Badge> : null}
          </View>
        </View>
        <View className="p-3.5">
          <Text className="font-bold text-black text-sm font-body leading-tight" numberOfLines={1}>{product.title}</Text>
          <View className="flex-row items-center justify-between mt-2.5">
            <View className="flex-row items-center gap-1.5">
              <Text className="font-bold text-black text-base font-display tracking-tight">${product.price}</Text>
              {product.comparePrice ? (
                <Text className="text-[10px] text-gray-400 line-through font-body">${product.comparePrice}</Text>
              ) : null}
            </View>
            <View className="flex-row items-center gap-0.5">
              <Ionicons name="star" size={10} color="#FFB800" />
              <Text className="text-[10px] text-gray-500 font-bold font-mono">{product.ratings_avg}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function ReviewCard({ review }: { review: any }) {
  return (
    <View className="w-72 rounded-[32px] bg-[#F5F5F5] p-6 mr-4 border border-black/5">
      <View className="flex-row gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons key={index} name="star" size={14} color={index < review.rating ? '#FFB800' : '#E5E7EB'} />
        ))}
      </View>
      <Text className="text-sm text-gray-700 leading-relaxed mb-6 font-body">&quot;{review.text}&quot;</Text>
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: review.avatar }} className="w-10 h-10 rounded-full border border-black/5" />
        <View>
          <Text className="font-bold text-black text-sm font-display tracking-tight">{review.author}</Text>
          <Text className="text-[10px] text-gray-400 font-body uppercase tracking-wider">Verified Purchase</Text>
        </View>
      </View>
    </View>
  );
}

export function BlogCard({ post }: { post: any }) {
  return (
    <Pressable onPress={() => router.push(`/blog/${post.slug}`)} className="w-64 mr-4">
      <View className="rounded-[32px] overflow-hidden bg-[#F5F5F5] border border-black/5">
        <View className="h-40">
          <Image source={{ uri: post.image }} className="w-full h-full" contentFit="cover" />
        </View>
        <View className="p-5">
          <Text className="text-[10px] uppercase tracking-[2px] text-[#84D347] font-black font-mono mb-2">{post.category}</Text>
          <Text className="font-bold text-black text-lg leading-6 font-display" numberOfLines={2}>{post.title}</Text>
          <Text className="text-[10px] text-gray-400 mt-3 font-body uppercase tracking-tighter">
            {new Date(post.publishedAt).toLocaleDateString()} • {post.readTime}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const scrollX = useSharedValue(0);
  const marqueeItems = [...items, ...items, ...items];
  const itemWidth = 180; // Estimated width
  const totalWidth = items.length * itemWidth;

  useEffect(() => {
    scrollX.value = 0;
    scrollX.value = withRepeat(
      withTiming(-totalWidth, {
        duration: items.length * 4000,
        paddingLeft: 0,
        easing: Easing.linear,
      } as any),
      -1,
      false
    );
    return () => cancelAnimation(scrollX);
  }, [items.length, totalWidth, scrollX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  return (
    <View className="bg-[#84D347] py-4 overflow-hidden -mx-4 mb-8">
      <Animated.View style={[animatedStyle, { flexDirection: 'row', alignItems: 'center' }]}>
        {marqueeItems.map((item, i) => (
          <View key={i} className="flex-row items-center px-6">
            <MaterialCommunityIcons name="star-four-points" size={14} color="rgba(0,0,0,0.3)" />
            <Text className="text-black text-[11px] font-black font-mono uppercase tracking-[3px] ml-4 font-bold">
              {item}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

export function FeatureBanner({ deal }: { deal: any }) {
  return (
    <View className="relative bg-black rounded-[36px] overflow-hidden p-8 mb-8 min-h-[340px] justify-between border border-white/10 mx-4">
      <Image source={{ uri: deal.image }} className="absolute inset-0 w-full h-full opacity-40" contentFit="cover" />
      <View className="absolute inset-0 bg-black/60" />
      
      <View className="relative z-10">
        <View className="self-start px-3 py-1 rounded-full bg-[#84D347] mb-6">
          <Text className="text-[10px] font-black text-black font-mono uppercase tracking-widest font-bold">{deal.badge}</Text>
        </View>
        <Text className="text-white text-4xl font-bold font-display leading-[42px] mb-3">{deal.title}</Text>
        <Text className="text-white/60 text-sm font-body leading-relaxed max-w-[240px]">{deal.description}</Text>
      </View>

      <View className="relative z-10 flex-row gap-3">
        {(deal.timerValues || [2, 14, 45]).map((val: number, i: number) => (
          <View key={i} className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 items-center min-w-[64px]">
            <Text className="text-white text-2xl font-bold font-display leading-tight">{val < 10 ? `0${val}` : val}</Text>
            <Text className="text-white/40 text-[9px] font-mono uppercase tracking-tighter">{(deal.timerUnits || ['HRS', 'MIN', 'SEC'])[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function EmptyState({ icon = 'cart-outline', title, message, actionHref, actionLabel }: { icon?: keyof typeof MaterialCommunityIcons.glyphMap; title: string; message: string; actionHref?: string; actionLabel?: string }) {
  return (
    <View className="bg-[#F5F5F5] rounded-[32px] p-8 items-center justify-center border border-black/5">
      <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-4 border border-black/5">
        <MaterialCommunityIcons name={icon} size={26} color="#C4C4C4" />
      </View>
      <Text className="text-2xl font-bold text-black text-center mb-2 font-display">{title}</Text>
      <Text className="text-sm text-gray-500 text-center leading-relaxed mb-6 font-body">{message}</Text>
      {actionHref ? (
        <Link href={actionHref} className="h-12 px-8 rounded-full bg-black items-center justify-center">
          <Text className="text-white font-bold text-sm uppercase tracking-widest font-mono">{actionLabel || 'Continue'}</Text>
        </Link>
      ) : null}
    </View>
  );
}
