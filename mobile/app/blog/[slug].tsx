// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Button } from 'heroui-native';

import { BrandLoader } from '@/components/brand-loader';
import { BlogCard, Screen, SectionHeading } from '@/components/storefront';
import { fetchBlogPostBySlug, fetchRelatedBlogPosts } from '@/lib/api';

export default function BlogDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBlogPostBySlug(String(slug)), fetchRelatedBlogPosts(String(slug))]).then(([article, suggestions]) => {
      setPost(article || null);
      setRelated(suggestions);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <BrandLoader subtitle="Loading article" />;
  }

  if (!post) {
    return <View className="flex-1 items-center justify-center bg-white px-6"><Text className="text-black font-black text-2xl">Article not found</Text></View>;
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <Button variant="secondary" size="sm" className="mb-4" onPress={() => router.back()}>
            <Button.Label>
              <Ionicons name="arrow-back" size={16} color="#111" />
            </Button.Label>
          </Button>
          <Image source={{ uri: post.image }} className="w-full h-72 rounded-[28px]" />
          <Text className="text-gray-500 text-xs uppercase tracking-[2px] font-bold mt-4">{post.category} • {post.readTime}</Text>
          <Text className="text-black font-black text-3xl mt-2 leading-tight">{post.title}</Text>
          <Text className="text-gray-600 leading-7 mt-4">{post.excerpt}</Text>
          <View className="mt-4 gap-3">
            {post.content.map((paragraph: string) => <Text key={paragraph} className="text-black/80 leading-7">{paragraph}</Text>)}
          </View>
        </View>

        <SectionHeading title="Related posts" />
        <View className="px-4 pb-10 gap-4">
          {related.map((item) => <BlogCard key={item.id} post={item} />)}
        </View>
      </ScrollView>
    </Screen>
  );
}
