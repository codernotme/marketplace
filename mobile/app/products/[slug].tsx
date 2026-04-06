// @ts-nocheck
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

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
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#111111" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <MaterialCommunityIcons name="close-circle-outline" size={48} color="#D1D5DB" />
        <Text className="text-black font-black text-2xl mt-4 mb-2">Product not found</Text>
        <Text className="text-gray-500 text-center mb-5">The product you opened is not available in the catalog.</Text>
        <Pressable onPress={() => router.back()} className="h-11 px-5 rounded-full bg-black items-center justify-center">
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const activeVariant = product.variants?.[selectedVariant] || product.variants?.[0];
  const isInWishlist = wishlistIds.includes(product.id);
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <Screen>
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center">
          <Ionicons name="arrow-back" size={18} color="#111" />
        </Pressable>
        <Text className="text-black font-black text-lg">Product Detail</Text>
        <Pressable onPress={() => toggleWishlist(product.id)} className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center">
          <Ionicons name={isInWishlist ? 'heart' : 'heart-outline'} size={18} color={isInWishlist ? '#EF4444' : '#111'} />
        </Pressable>
      </View>

      <View className="px-4 mb-5">
        <View className="rounded-[30px] overflow-hidden bg-[#F5F5F5]">
          <View className="h-[360px] bg-white">
            <Image source={{ uri: product.images?.[0] }} className="w-full h-full" contentFit="cover" />
          </View>
          {discount > 0 ? (
            <View className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black">
              <Text className="text-white text-xs font-bold">-{discount}%</Text>
            </View>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {(product.images || []).map((image: string, index: number) => (
            <View key={image + index} className={`w-20 h-20 mr-3 rounded-2xl overflow-hidden border-2 ${index === 0 ? 'border-black' : 'border-transparent'}`}>
              <Image source={{ uri: image }} className="w-full h-full" contentFit="cover" />
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="px-4">
        <Text className="text-[#84D347] text-xs font-black uppercase tracking-[3px] mb-2">{product.brand}</Text>
        <Text className="text-black text-3xl font-black tracking-tight leading-9 mb-2">{product.title}</Text>
        <View className="flex-row items-center gap-2 mb-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text className="text-sm font-bold text-black">{product.ratings_avg}</Text>
          </View>
          <Text className="text-sm text-gray-400">({product.ratings_count} reviews)</Text>
          <View className="ml-auto px-3 py-1 rounded-full bg-[#F5F5F5]"><Text className="text-xs font-bold text-black">{activeVariant?.stock > 0 ? 'In Stock' : 'Out of Stock'}</Text></View>
        </View>

        <View className="flex-row items-end gap-3 mb-4">
          <Text className="text-black text-4xl font-black">${activeVariant?.price ?? product.price}</Text>
          {product.comparePrice ? <Text className="text-gray-400 line-through text-lg">${product.comparePrice}</Text> : null}
        </View>

        <Text className="text-gray-500 leading-6 mb-5">{product.description}</Text>

        <View className="mb-5">
          <Text className="text-black font-black mb-3">Select Option</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(product.variants || []).map((variant: any, index: number) => (
              <Pressable key={variant.id} onPress={() => setSelectedVariant(index)} className={`mr-2 px-4 h-11 rounded-full justify-center border ${selectedVariant === index ? 'bg-black border-black' : 'bg-white border-gray-200'}`}>
                <Text className={`text-sm font-bold ${selectedVariant === index ? 'text-white' : 'text-black'}`}>{variant.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row items-center gap-3 mb-5">
          <View className="flex-row items-center rounded-full bg-[#F5F5F5] p-1">
            <Pressable onPress={() => setQuantity((current) => Math.max(1, current - 1))} className="w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-black font-black text-xl">-</Text>
            </Pressable>
            <Text className="w-10 text-center font-black text-black">{quantity}</Text>
            <Pressable onPress={() => setQuantity((current) => current + 1)} className="w-10 h-10 rounded-full items-center justify-center">
              <Text className="text-black font-black text-xl">+</Text>
            </Pressable>
          </View>
          <Text className="text-sm text-gray-400">{activeVariant?.stock ?? 0} units left</Text>
        </View>

        <View className="flex-row gap-3 mb-6">
          <Pressable
            onPress={() => addToCart({
              id: `${product.id}-${activeVariant?.id || 'base'}`,
              productId: product.id,
              variantId: activeVariant?.id || 'base',
              title: product.title,
              price: activeVariant?.price ?? product.price,
              image: product.images?.[0],
              variantLabel: activeVariant?.name || 'Default',
            }, quantity)}
            className="flex-1 h-12 rounded-2xl bg-black items-center justify-center"
          >
            <Text className="text-white font-bold">Add to Cart</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/checkout')} className="flex-1 h-12 rounded-2xl border border-gray-200 items-center justify-center">
            <Text className="text-black font-bold">Buy Now</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2 mb-6">
          {[
            { icon: 'truck-delivery-outline', label: 'Free Shipping over $100' },
            { icon: 'shield-check-outline', label: '2-Year Warranty' },
            { icon: 'rotate-left', label: '30-Day Returns' },
          ].map((item) => (
            <View key={item.label} className="flex-row items-center gap-2 bg-[#F5F5F5] px-4 py-2 rounded-full">
              <MaterialCommunityIcons name={item.icon as any} size={16} color="#84D347" />
              <Text className="text-xs font-semibold text-gray-700">{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-4 mt-2">
        <Text className="text-2xl font-black text-black mb-4">Customer Reviews</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ScrollView>
      </View>

      {relatedProducts.length > 0 ? (
        <View className="px-4 mt-6">
          <Text className="text-2xl font-black text-black mb-4">You May Also Like</Text>
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
