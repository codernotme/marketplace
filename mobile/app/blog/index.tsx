// @ts-nocheck
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { BlogCard, Screen, SectionHeading, SiteHeader } from '@/components/storefront';
import { fetchBlogPosts } from '@/lib/api';

export default function BlogListScreen() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchBlogPosts().then(setPosts);
  }, []);

  return (
    <Screen>
      <SiteHeader title="Blog" subtitle="Stories and guides" />
      <SectionHeading title="Latest articles" />
      <View className="px-4 pb-8 gap-4">
        {posts.map((post) => <BlogCard key={post.id} post={post} />)}
      </View>
    </Screen>
  );
}
