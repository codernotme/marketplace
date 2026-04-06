import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { storefrontContent } from '@/data/mock';

export function Screen({ children }: { children: React.ReactNode }) {
  return <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-10">{children}</ScrollView>;
}

export function SiteHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const brand = storefrontContent.brand;

  return (
    <View className="px-4 pt-4 pb-3">
      <View className="flex-row items-center justify-between mb-4">
        <Link href="/" className="flex-row items-center gap-2">
          <Image source={require('@/assets/images/logo.png')} className="w-9 h-9 rounded-xl" contentFit="cover" />
          <Text className="text-black font-black text-lg tracking-tight">{brand.siteName}</Text>
        </Link>

        <View className="flex-row items-center gap-3">
          <Link href="/search" className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center">
            <Ionicons name="search" size={18} color="#111" />
          </Link>
          <Link href="/wishlist" className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center">
            <Ionicons name="heart-outline" size={18} color="#111" />
          </Link>
        </View>
      </View>

      <Text className="text-xs font-black uppercase tracking-[3px] text-[#84D347] mb-1">{subtitle || brand.defaultHeaderSubtitle}</Text>
      <Text className="text-3xl font-black tracking-tight text-black">{title}</Text>
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
    <View className="flex-row items-center justify-between px-4 mb-4 mt-2">
      <View>
        {eyebrow ? <Text className="text-xs font-black uppercase tracking-[3px] text-[#84D347] mb-1">{eyebrow}</Text> : null}
        <Text className="text-2xl font-black tracking-tight text-black">{title}</Text>
      </View>
      {actionHref ? (
        <Link href={actionHref} className="text-sm font-bold text-gray-400 flex-row items-center">
          {actionLabel || 'See all'}
        </Link>
      ) : null}
    </View>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <View className="px-3 py-1.5 rounded-full bg-[#F5F5F5]"><Text className="text-xs font-bold text-black">{children}</Text></View>;
}

export function CategoryTile({ item }: { item: { id: string; slug: string; name: string; image: string; count: number } }) {
  return (
    <Pressable onPress={() => router.push(`/category/${item.slug}`)} className="w-[31%] rounded-3xl overflow-hidden bg-[#F5F5F5] mb-3">
      <View className="h-28">
        <Image source={{ uri: item.image }} className="w-full h-full" contentFit="cover" />
        <View className="absolute inset-0 bg-black/25" />
      </View>
      <View className="p-3">
        <Text className="font-bold text-black text-sm" numberOfLines={1}>{item.name}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">{item.count} items</Text>
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
    <Pressable onPress={() => router.push(`/products/${product.slug}`)} className="w-[48%] mb-4">
      <View className="rounded-3xl overflow-hidden bg-[#F5F5F5]">
        <View className="aspect-square bg-white">
          <Image source={{ uri: image }} className="w-full h-full" contentFit="cover" />
          {(product.is_new || product.is_trending || discount > 0) && (
            <View className="absolute top-3 left-3 flex-row flex-wrap gap-2">
              {discount > 0 ? <Badge>{`-${discount}%`}</Badge> : null}
              {product.is_new ? <Badge>NEW</Badge> : null}
              {product.is_trending ? <Badge>TRENDING</Badge> : null}
            </View>
          )}
        </View>
        <View className="p-3">
          <Text className="font-bold text-black text-sm" numberOfLines={2}>{product.title}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <Text className="font-black text-black">${product.price}</Text>
            {product.comparePrice ? <Text className="text-xs text-gray-400 line-through">${product.comparePrice}</Text> : null}
          </View>
          <View className="flex-row items-center gap-1 mt-2">
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text className="text-xs text-gray-500 font-semibold">{product.ratings_avg}</Text>
            <Text className="text-xs text-gray-400">({product.ratings_count})</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function ReviewCard({ review }: { review: any }) {
  return (
    <View className="w-80 rounded-3xl bg-[#F5F5F5] p-5 mr-4">
      <View className="flex-row gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons key={index} name="star" size={14} color={index < review.rating ? '#FFB800' : '#E5E7EB'} />
        ))}
      </View>
      <Text className="text-sm text-gray-700 leading-5 mb-4">&quot;{review.text}&quot;</Text>
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: review.avatar }} className="w-10 h-10 rounded-full" />
        <View>
          <Text className="font-bold text-black text-sm">{review.author}</Text>
          <Text className="text-xs text-gray-400">Purchased review</Text>
        </View>
      </View>
    </View>
  );
}

export function BlogCard({ post }: { post: any }) {
  return (
    <Pressable onPress={() => router.push(`/blog/${post.slug}`)} className="w-72 mr-4">
      <View className="rounded-3xl overflow-hidden bg-[#F5F5F5]">
        <View className="h-40">
          <Image source={{ uri: post.image }} className="w-full h-full" contentFit="cover" />
        </View>
        <View className="p-4">
          <Text className="text-xs uppercase tracking-widest text-[#84D347] font-bold mb-2">{post.category}</Text>
          <Text className="font-black text-black text-lg leading-6" numberOfLines={2}>{post.title}</Text>
          <Text className="text-xs text-gray-400 mt-2">{new Date(post.publishedAt).toLocaleDateString()} • {post.readTime}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function EmptyState({ icon = 'cart-outline', title, message, actionHref, actionLabel }: { icon?: keyof typeof MaterialCommunityIcons.glyphMap; title: string; message: string; actionHref?: string; actionLabel?: string }) {
  return (
    <View className="bg-[#F5F5F5] rounded-3xl p-8 items-center justify-center">
      <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-4">
        <MaterialCommunityIcons name={icon} size={26} color="#C4C4C4" />
      </View>
      <Text className="text-xl font-black text-black text-center mb-2">{title}</Text>
      <Text className="text-sm text-gray-500 text-center leading-5 mb-5">{message}</Text>
      {actionHref ? (
        <Link href={actionHref} className="h-11 px-5 rounded-full bg-black items-center justify-center">
          <Text className="text-white font-bold text-sm">{actionLabel || 'Continue'}</Text>
        </Link>
      ) : null}
    </View>
  );
}
