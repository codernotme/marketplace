// @ts-nocheck
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from 'heroui-native';

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
        <Text className="text-black font-black text-2xl mt-4 mb-2">Product not found</Text>
        <Text className="text-gray-500 text-center mb-5">The product you opened is not available in the catalog.</Text>
        <Button variant="primary" onPress={() => router.back()}>
          <Button.Label>Go Back</Button.Label>
        </Button>
      </View>
    );
  }

  const activeVariant = product.variants?.[selectedVariant] || product.variants?.[0];
  const isInWishlist = wishlistIds.includes(product.id);
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <Screen>
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Button variant="secondary" size="sm" onPress={() => router.back()}>
          <Button.Label>
            <Ionicons name="arrow-back" size={16} color="#111" />
          </Button.Label>
        </Button>
        <Text className="text-black font-black text-lg">Product Detail</Text>
        <Button variant="secondary" size="sm" onPress={() => toggleWishlist(product.id)}>
          <Button.Label>
            <Ionicons name={isInWishlist ? 'heart' : 'heart-outline'} size={16} color={isInWishlist ? '#EF4444' : '#111'} />
          </Button.Label>
        </Button>
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
              <Button
                key={variant.id}
                variant={selectedVariant === index ? 'primary' : 'secondary'}
                size="sm"
                className="mr-2"
                onPress={() => setSelectedVariant(index)}
              >
                <Button.Label>{variant.name}</Button.Label>
              </Button>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row items-center gap-3 mb-5">
          <View className="flex-row items-center rounded-full bg-[#F5F5F5] p-1">
            <Button variant="secondary" size="sm" onPress={() => setQuantity((current) => Math.max(1, current - 1))}>
              <Button.Label>-</Button.Label>
            </Button>
            <Text className="w-10 text-center font-black text-black">{quantity}</Text>
            <Button variant="secondary" size="sm" onPress={() => setQuantity((current) => current + 1)}>
              <Button.Label>+</Button.Label>
            </Button>
          </View>
          <Text className="text-sm text-gray-400">{activeVariant?.stock ?? 0} units left</Text>
        </View>

        <View className="flex-row gap-3 mb-6">
          <Button
            variant="primary"
            className="flex-1"
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
            <Button.Label>Add to Cart</Button.Label>
          </Button>
          <Button variant="outline" className="flex-1" onPress={() => router.push('/checkout')}>
            <Button.Label>Buy Now</Button.Label>
          </Button>
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
