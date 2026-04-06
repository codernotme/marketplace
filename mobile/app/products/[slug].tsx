// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';

import { BrandLoader } from '@/components/brand-loader';
import { ProductCard, ReviewCard, Screen } from '@/components/storefront';
import { useAppContext } from '@/context/app-context';
import { fetchProductBySlug, fetchProductReviews, fetchProducts } from '@/lib/api';

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { addToCart, toggleWishlist, wishlistIds } = useAppContext();
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchProductBySlug(String(slug)),
      fetchProducts(),
      fetchProductReviews(String(slug === 'minimalist-watch' ? 'p1' : 'p2')),
    ]).then(([productData, productsData, reviewsData]) => {
      if (!active) return;
      setProduct(productData || null);
      setAllProducts(productsData);
      setReviews(reviewsData);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  const relatedProducts = useMemo(
    () => allProducts.filter((item) => item.id !== product?.id && item.category_id === product?.category_id).slice(0, 4),
    [allProducts, product],
  );

  if (loading) {
    return <BrandLoader subtitle="Loading product details" />;
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <MaterialCommunityIcons name="close-circle-outline" size={48} color="#D1D5DB" />
        <Text className="text-black font-bold text-2xl mt-4 mb-2 font-display">Product not found</Text>
        <Text className="text-gray-500 text-center mb-6 font-body">The product you opened is not available in the catalog.</Text>
        <Pressable 
          onPress={() => router.back()}
          className="bg-black h-12 px-8 rounded-full items-center justify-center"
        >
          <Text className="text-white font-bold text-sm uppercase tracking-widest font-mono">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const activeVariant = product.variants?.[selectedVariant] || product.variants?.[0];
  const isInWishlist = wishlistIds.includes(product.id);
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <Screen bg="bg-white">
      <View className="px-4 pt-2 pb-6 flex-row items-center justify-between">
        <Pressable 
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-[#F5F5F5] border border-black/5 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="#111" />
        </Pressable>
        <Text className="text-black font-bold text-sm font-mono uppercase tracking-widest">Detail</Text>
        <Pressable 
          onPress={() => toggleWishlist(product.id)}
          className="w-11 h-11 rounded-full bg-[#F5F5F5] border border-black/5 items-center justify-center"
        >
          <Ionicons name={isInWishlist ? 'heart' : 'heart-outline'} size={20} color={isInWishlist ? '#EF4444' : '#111'} />
        </Pressable>
      </View>

      <View className="px-4 mb-8">
        <View className="rounded-[40px] overflow-hidden bg-[#F5F5F5] border border-black/5">
          <View className="h-[400px] bg-white relative">
            <Image source={{ uri: product.images?.[0] }} className="w-full h-full" contentFit="cover" />
            {discount > 0 ? (
              <View className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-[#84D347] shadow-sm">
                <Text className="text-black text-[10px] font-black font-mono">-{discount}% OFF</Text>
              </View>
            ) : null}
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4" contentContainerStyle={{ gap: 12 }}>
          {(product.images || []).map((image: string, index: number) => (
            <Pressable key={image + index} className={`w-20 h-20 rounded-[20px] overflow-hidden border ${index === 0 ? 'border-black' : 'border-black/5 bg-[#F5F5F5]'}`}>
              <Image source={{ uri: image }} className="w-full h-full" contentFit="cover" />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="px-5">
        <View className="flex-row items-center gap-2 mb-3">
           <View className="w-1.5 h-1.5 rounded-full bg-[#84D347]" />
           <Text className="text-[#84D347] text-[10px] font-black uppercase tracking-[3px] font-mono">{product.brand}</Text>
        </View>
        <Text className="text-black text-4xl font-bold tracking-tight leading-[44px] mb-4 font-display">{product.title}</Text>
        
        <View className="flex-row items-center gap-4 mb-6">
          <View className="flex-row items-center gap-1.5 bg-[#F5F5F5] px-3 py-1.5 rounded-full border border-black/5">
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text className="text-xs font-bold text-black font-mono">{product.ratings_avg}</Text>
          </View>
          <Text className="text-xs text-gray-400 font-body lowercase tracking-tighter">{product.ratings_count} verified reviews</Text>
          <View className="ml-auto px-4 py-1.5 rounded-full bg-[#F5F5F5] border border-black/5">
            <Text className="text-[10px] font-black text-black font-mono uppercase tracking-widest">{activeVariant?.stock > 0 ? 'In Stock' : 'Sold Out'}</Text>
          </View>
        </View>

        <View className="flex-row items-end gap-3 mb-8">
          <Text className="text-black text-5xl font-bold font-display">${activeVariant?.price ?? product.price}</Text>
          {product.comparePrice ? (
            <Text className="text-gray-400 line-through text-xl font-display mb-1.5">${product.comparePrice}</Text>
          ) : null}
        </View>

        <Text className="text-gray-500 text-base leading-7 mb-8 font-body">{product.description}</Text>

        <View className="mb-8">
          <Text className="text-black text-xs font-black uppercase tracking-widest mb-4 font-mono">Select Option</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {(product.variants || []).map((variant: any, index: number) => (
              <Pressable
                key={variant.id}
                className={`h-11 px-6 rounded-2xl items-center justify-center border ${selectedVariant === index ? 'bg-black border-black' : 'bg-white border-black/10'}`}
                onPress={() => setSelectedVariant(index)}
              >
                <Text className={`text-xs font-bold uppercase tracking-widest font-mono ${selectedVariant === index ? 'text-white' : 'text-black'}`}>
                  {variant.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row items-center gap-4 mb-8">
          <View className="flex-row items-center rounded-3xl bg-[#F5F5F5] p-1 border border-black/5">
            <Pressable 
              onPress={() => setQuantity((current) => Math.max(1, current - 1))}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            >
              <Text className="text-black font-bold font-mono">-</Text>
            </Pressable>
            <Text className="w-12 text-center font-black text-black font-mono text-lg">{quantity}</Text>
            <Pressable 
              onPress={() => setQuantity((current) => current + 1)}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            >
              <Text className="text-black font-bold font-mono">+</Text>
            </Pressable>
          </View>
          <Text className="text-xs text-gray-400 font-body italic">{activeVariant?.stock ?? 0} items remaining</Text>
        </View>

        <View className="flex-row gap-4 mb-10">
          <Pressable
            className="flex-[1.5] bg-[#84D347] h-16 rounded-[24px] items-center justify-center shadow-lg active:scale-95 transition-transform"
            onPress={() => addToCart({
              id: `${product.id}-${activeVariant?.id || 'base'}`,
              productId: product.id,
              variantId: activeVariant?.id || 'base',
              title: product.title,
              price: activeVariant?.price ?? product.price,
              image: product.images?.[0],
              variantLabel: activeVariant?.name || 'Default',
            }, quantity)}
          >
            <Text className="text-black font-black text-sm uppercase tracking-widest font-mono">Add to Cart</Text>
          </Pressable>
          <Pressable 
            className="flex-1 border border-black h-16 rounded-[24px] items-center justify-center active:scale-95 transition-transform"
            onPress={() => router.push('/checkout')}
          >
            <Text className="text-black font-black text-sm uppercase tracking-widest font-mono">Buy Now</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2 mb-12">
          {[
            { icon: 'truck-delivery-outline', label: 'Priority Shipping' },
            { icon: 'shield-check-outline', label: 'AUTHENTICITY GUARANTEE' },
            { icon: 'rotate-left', label: 'EASY RETURNS' },
          ].map((item) => (
            <View key={item.label} className="flex-row items-center gap-2 bg-[#F5F5F5] px-4 py-2.5 rounded-2xl border border-black/5">
              <MaterialCommunityIcons name={item.icon as any} size={14} color="#84D347" />
              <Text className="text-[10px] font-black text-gray-600 font-mono uppercase tracking-tight">{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-5 mb-10">
        <Text className="text-3xl font-bold text-black mb-6 font-display tracking-tight">Reviews</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 0 }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ScrollView>
      </View>

      {relatedProducts.length > 0 ? (
        <View className="px-5 mt-4">
          <Text className="text-3xl font-bold text-black mb-6 font-display tracking-tight">You May Also Like</Text>
          <View className="flex-row flex-wrap justify-between">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
