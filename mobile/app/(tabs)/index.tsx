import React from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BlogCard, CategoryTile, ProductCard, ReviewCard, Screen, SectionHeading, SiteHeader } from '@/components/storefront';
import { fetchBlogPosts, fetchCategories, fetchFeaturedProducts, fetchNewArrivals, fetchProductReviews, fetchStorefrontContent, fetchTrendingProducts } from '@/lib/api';

export default function HomeScreen() {
  const { useEffect, useState } = React as any;
  const [categories, setCategories] = useState([] as any[]);
  const [featuredProducts, setFeaturedProducts] = useState([] as any[]);
  const [trendingProducts, setTrendingProducts] = useState([] as any[]);
  const [newArrivals, setNewArrivals] = useState([] as any[]);
  const [blogPosts, setBlogPosts] = useState([] as any[]);
  const [reviews, setReviews] = useState([] as any[]);
  const [content, setContent] = useState(null as any);

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchFeaturedProducts(),
      fetchTrendingProducts(),
      fetchNewArrivals(),
      fetchBlogPosts(),
      fetchProductReviews('p1'),
      fetchStorefrontContent(),
    ]).then(([loadedCategories, loadedFeaturedProducts, loadedTrendingProducts, loadedNewArrivals, loadedBlogPosts, loadedReviews, loadedContent]) => {
      setCategories(loadedCategories);
      setFeaturedProducts(loadedFeaturedProducts);
      setTrendingProducts(loadedTrendingProducts);
      setNewArrivals(loadedNewArrivals);
      setBlogPosts(loadedBlogPosts);
      setReviews(loadedReviews);
      setContent(loadedContent);
    });
  }, []);

  const homeContent = content?.home;
  const hero = homeContent?.hero;
  const sections = homeContent?.sections;

  return (
    <Screen>
      <SiteHeader title={hero?.title || 'Shop the Future of Style.'} subtitle={hero?.badge || 'New season arrivals'} />

      <View className="px-4 mb-6">
        <View className="rounded-[32px] overflow-hidden bg-black">
          <View className="h-[420px]">
            <Image
              source={{ uri: hero?.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80' }}
              className="w-full h-full"
              contentFit="cover"
            />
            <View className="absolute inset-0 bg-black/55" />
          </View>
          <View className="absolute inset-0 p-6 justify-between">
            <View className="self-start px-3 py-1.5 rounded-full bg-white/10 border border-white/15 flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-[#84D347]" />
              <Text className="text-white text-xs font-bold uppercase tracking-[2px]">{hero?.badge || 'New Season Arrivals'}</Text>
            </View>
            <View>
              <Text className="text-white text-4xl font-black leading-[44px] tracking-tight mb-4">{hero?.title || 'Shop the Future of Style.'}</Text>
              <Text className="text-white/75 text-sm leading-5 mb-5 max-w-[280px]">{hero?.description || 'Curated collections from the world\'s most innovative brands. Premium quality, authentic products, delivered to your door.'}</Text>
              <View className="flex-row gap-3">
                <Pressable onPress={() => router.push(hero?.primaryCtaHref || '/shop')} className="h-12 px-5 rounded-full bg-white items-center justify-center">
                  <Text className="text-black font-bold text-sm">{hero?.primaryCtaLabel || 'Shop Now'}</Text>
                </Pressable>
                <Pressable onPress={() => router.push(hero?.secondaryCtaHref || '/category/men')} className="h-12 px-5 rounded-full border border-white/30 items-center justify-center">
                  <Text className="text-white font-bold text-sm">{hero?.secondaryCtaLabel || 'Browse Men'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mt-4">
          {(hero?.stats || []).map((stat: any) => (
            <View key={stat.label} className="flex-1 rounded-2xl bg-[#F5F5F5] p-3">
              <Text className="text-black text-2xl font-black">{stat.value}</Text>
              <Text className="text-gray-500 text-xs font-bold uppercase tracking-[1.5px] mt-1">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-[#84D347] py-3 mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 28, alignItems: 'center' }}>
          {(homeContent?.marqueeItems || []).map((item: string) => (
            <Text key={item} className="text-black text-xs font-black uppercase tracking-[3px]">{item}</Text>
          ))}
        </ScrollView>
      </View>

      <SectionHeading
        eyebrow={sections?.categories?.eyebrow}
        title={sections?.categories?.title || 'Shop by Category'}
        actionHref={sections?.categories?.actionHref || '/shop'}
        actionLabel={sections?.categories?.actionLabel || 'See all'}
      />
      <View className="px-4 flex-row flex-wrap justify-between mb-3">
        {categories.map((item: any) => (
          <CategoryTile key={item.id} item={item} />
        ))}
      </View>

      <SectionHeading
        eyebrow={sections?.trending?.eyebrow}
        title={sections?.trending?.title || 'Trending Products'}
        actionHref={sections?.trending?.actionHref || '/shop'}
        actionLabel={sections?.trending?.actionLabel || 'See more'}
      />
      <View className="px-4 flex-row flex-wrap justify-between mb-3">
        {trendingProducts.slice(0, 6).map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>

      <View className="px-4 mt-2 mb-8">
        <View className="rounded-[28px] bg-black p-5 mb-4 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-xs font-black uppercase tracking-[3px] text-[#84D347] mb-3">{homeContent?.deal?.badge || 'Deal of the day'}</Text>
            <Text className="text-white text-2xl font-black mb-2">{homeContent?.deal?.title || 'DR CRZ Varsity Jacket'}</Text>
            <Text className="text-white/70 text-sm mb-5">{homeContent?.deal?.description || 'Limited stock. Up to 25% off premium outerwear.'}</Text>
            <Pressable onPress={() => router.push(homeContent?.deal?.ctaHref || '/products/varsity-jacket')} className="h-11 w-36 rounded-full bg-white items-center justify-center">
              <Text className="text-black font-bold text-sm">{homeContent?.deal?.ctaLabel || 'Shop Deal'}</Text>
            </Pressable>
          </View>
        </View>

        <View className="rounded-[24px] bg-[#F5F5F5] p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-black text-xl font-black">New Arrivals</Text>
            <Pressable onPress={() => router.push('/shop')}>
              <Text className="text-xs font-bold uppercase tracking-[2px] text-gray-400">See all</Text>
            </Pressable>
          </View>
          <View className="gap-3">
            {newArrivals.slice(0, 4).map((item: any) => (
              <Pressable key={item.id} onPress={() => router.push(`/products/${item.slug}`)} className="bg-white rounded-2xl p-3 flex-row items-center justify-between">
                <View>
                  <Text className="text-black font-bold" numberOfLines={1}>{item.title}</Text>
                  <Text className="text-gray-500 text-xs mt-1">{item.brand}</Text>
                </View>
                <Text className="text-black font-black">${item.price}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <SectionHeading eyebrow={sections?.featured?.eyebrow} title={sections?.featured?.title || 'Featured Collection'} />
      <View className="px-4 flex-row flex-wrap justify-between mb-4">
        {featuredProducts.slice(0, 4).map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>

      <SectionHeading eyebrow={sections?.reviews?.eyebrow} title={sections?.reviews?.title || 'What Customers Say'} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 8 }}>
        {reviews.slice(0, 3).map((review: any) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ScrollView>

      <SectionHeading
        eyebrow={sections?.blog?.eyebrow}
        title={sections?.blog?.title || 'Blog Posts'}
        actionHref={sections?.blog?.actionHref || '/blog'}
        actionLabel={sections?.blog?.actionLabel || 'Latest'}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 8 }}>
        {blogPosts.slice(0, 3).map((post: any) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </ScrollView>

      <View className="px-4 mt-6">
        <View className="rounded-[28px] bg-black p-6">
          <Text className="text-xs font-black uppercase tracking-[3px] text-[#84D347] mb-2">{homeContent?.newsletter?.eyebrow || 'Insider access'}</Text>
          <Text className="text-white text-2xl font-black mb-2">{homeContent?.newsletter?.title || 'Get Exclusive Offers First'}</Text>
          <Text className="text-white/70 text-sm mb-4">{homeContent?.newsletter?.description || 'Subscribe to our insider list and get early access to deals, drops and new arrivals.'}</Text>
          <View className="flex-row gap-3">
            <View className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 px-4 justify-center">
              <Text className="text-white/40 text-sm">{homeContent?.newsletter?.placeholder || 'Enter your email...'}</Text>
            </View>
            <Pressable className="h-12 px-5 rounded-2xl bg-[#84D347] justify-center">
              <Text className="text-black font-black text-sm">{homeContent?.newsletter?.ctaLabel || 'Subscribe'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}
