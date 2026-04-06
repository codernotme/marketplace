import React from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { Button } from 'heroui-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { BrandLoader } from '@/components/brand-loader';
import { 
  BlogCard, 
  CategoryTile, 
  ProductCard, 
  ReviewCard, 
  Screen, 
  SectionHeading, 
  SiteHeader,
  Marquee,
  FeatureBanner
} from '@/components/storefront';
import { 
  fetchBlogPosts, 
  fetchCategories, 
  fetchFeaturedProducts, 
  fetchNewArrivals, 
  fetchProductReviews, 
  fetchStorefrontContent, 
  fetchTrendingProducts 
} from '@/lib/api';

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

  if (!content) {
    return <BrandLoader subtitle="Loading storefront" />;
  }

  return (
    <Screen bg="bg-white">
      <SiteHeader title={hero?.title || 'Shop the Future of Style.'} subtitle={hero?.badge || 'New season arrivals'} />

      <View className="px-4 mb-10">
        <View className="rounded-[44px] overflow-hidden bg-black min-h-[580px] shadow-2xl relative border border-white/5">
          <Image
            source={{ uri: hero?.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80' }}
            className="absolute inset-0 w-full h-full opacity-60"
            contentFit="cover"
          />
          <View className="absolute inset-0 bg-black/40" />
          
          <View className="absolute inset-0 p-8 justify-between">
            {/* Top Badge */}
            <View className="self-start px-5 py-2.5 rounded-full bg-white/10 border border-white/15 flex-row items-center gap-3 backdrop-blur-md">
              <View className="w-1.5 h-1.5 rounded-full bg-[#84D347]" />
              <Text className="text-white text-[10px] font-black uppercase tracking-[3px] font-mono">{hero?.badge || 'New Season Arrivals'}</Text>
            </View>

            {/* Floating Stat Cards - Mobile Style */}
            <View className="absolute right-6 top-40 gap-4 items-end">
               <View className="bg-white/10 border border-white/20 px-4 py-3 rounded-2xl backdrop-blur-md items-end">
                  <Text className="text-[#84D347] text-xl font-bold font-display">12K+</Text>
                  <Text className="text-white/40 text-[8px] font-black uppercase tracking-widest font-mono">Happy Customers</Text>
               </View>
               <View className="bg-[#84D347] px-4 py-3 rounded-2xl items-end shadow-lg">
                  <Text className="text-black text-xl font-bold font-display">500+</Text>
                  <Text className="text-black/60 text-[8px] font-black uppercase tracking-widest font-mono">Premium Products</Text>
               </View>
            </View>

            {/* Bottom Content */}
            <View>
              <Text className="text-white text-6xl font-bold leading-[64px] tracking-tight mb-6 font-display">
                {hero?.titleLead || 'Shop the'}{'\n'}
                <Text className="text-[#84D347]">{hero?.titleHighlight || 'Future'}</Text>{'\n'}
                {hero?.titleTail || 'of Style.'}
              </Text>
              
              <Text className="text-white/70 text-base leading-relaxed mb-10 max-w-[300px] font-body">
                {hero?.description || 'Curated collections from the world\'s most innovative brands. Experience the next generation of premium streetwear.'}
              </Text>

              <View className="flex-row gap-4">
                <Pressable 
                  onPress={() => router.push(hero?.primaryCtaHref || '/shop')}
                  className="bg-white h-16 px-10 rounded-full items-center justify-center shadow-2xl active:scale-95 transition-transform"
                >
                  <Text className="text-black font-black text-sm uppercase tracking-widest font-mono">Shop Now</Text>
                </Pressable>
                <Pressable 
                  onPress={() => router.push(hero?.secondaryCtaHref || '/category/men')}
                  className="bg-white/5 border border-white/20 h-16 px-10 rounded-full items-center justify-center active:scale-95 transition-transform backdrop-blur-sm"
                >
                  <Text className="text-white font-black text-sm uppercase tracking-widest font-mono">Browse</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Marquee items={homeContent?.marqueeItems || ['Premium Quality', 'Fast Shipping', 'Authentic Gear', 'Secure Payment']} />

      <SectionHeading
        eyebrow={sections?.categories?.eyebrow}
        title={sections?.categories?.title || 'Shop by Category'}
        actionHref={sections?.categories?.actionHref || '/shop'}
        actionLabel={sections?.categories?.actionLabel || 'See all'}
      />
      <View className="px-4 flex-row flex-wrap justify-between mb-8">
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
      <View className="px-4 flex-row flex-wrap justify-between mb-8">
        {trendingProducts.slice(0, 4).map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>

      <FeatureBanner deal={homeContent?.deal || {}} />

      <View className="px-4 mb-12">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-bold text-black font-display tracking-tight">New Arrivals</Text>
          <Pressable onPress={() => router.push('/shop')}>
             <Text className="text-xs font-bold text-gray-400 font-body uppercase tracking-tighter">View All</Text>
          </Pressable>
        </View>
        
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {newArrivals.slice(0, 4).map((item: any) => (
            <Pressable 
              key={item.id} 
              className="w-[48%] flex-row items-center gap-3 p-3 bg-[#F5F5F5] rounded-[24px] border border-black/5"
              onPress={() => router.push(`/products/${item.slug}`)}
            >
              <View className="w-12 h-12 bg-white rounded-2xl overflow-hidden border border-black/5 items-center justify-center">
                 <Image source={{ uri: item.images?.[0] }} className="w-full h-full" contentFit="cover" />
              </View>
              <View className="flex-1">
                 <Text className="text-black font-bold text-xs font-body" numberOfLines={1}>{item.title}</Text>
                 <Text className="text-black font-bold text-sm font-display">${item.price}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <SectionHeading eyebrow={sections?.featured?.eyebrow} title={sections?.featured?.title || 'Featured Collection'} />
      <View className="px-4 flex-row flex-wrap justify-between mb-8">
        {featuredProducts.slice(0, 4).map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>

      <SectionHeading eyebrow={sections?.reviews?.eyebrow} title={sections?.reviews?.title || 'What Customers Say'} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 8 }} className="mb-12">
        {reviews.slice(0, 3).map((review: any) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ScrollView>

      <SectionHeading
        eyebrow={sections?.blog?.eyebrow}
        title={sections?.blog?.title || 'Latest from Blog'}
        actionHref={sections?.blog?.actionHref || '/blog'}
        actionLabel={sections?.blog?.actionLabel || 'All posts'}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 8 }} className="mb-12">
        {blogPosts.slice(0, 3).map((post: any) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </ScrollView>

      <View className="px-4 mt-4">
        <View className="rounded-[40px] bg-black p-10 border border-white/10 relative overflow-hidden">
          <View className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full bg-[#84D347]/10" />
          
          <Text className="text-[10px] font-black uppercase tracking-[3px] text-[#84D347] mb-4 font-mono">{homeContent?.newsletter?.eyebrow || 'Insider access'}</Text>
          <Text className="text-white text-4xl font-bold font-display mb-4 leading-tight">{homeContent?.newsletter?.title || 'Join the Inner Circle'}</Text>
          <Text className="text-white/60 text-sm mb-10 leading-relaxed font-body">{homeContent?.newsletter?.description || 'Subscribe to our insider list and get early access to deals, drops and new arrivals.'}</Text>
          
          <View className="gap-4">
            <View className="h-16 rounded-[24px] bg-white/5 border border-white/15 px-6 justify-center">
              <Text className="text-white/40 text-sm font-body">{homeContent?.newsletter?.placeholder || 'name@email.com'}</Text>
            </View>
            <Pressable className="bg-[#84D347] h-16 rounded-[24px] items-center justify-center shadow-[0_12px_40px_rgba(132,211,71,0.2)]">
              <Text className="text-black font-black text-sm uppercase tracking-widest font-mono font-bold">{homeContent?.newsletter?.ctaLabel || 'Subscribe'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}
