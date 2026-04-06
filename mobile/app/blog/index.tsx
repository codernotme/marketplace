// @ts-nocheck
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { BrandLoader } from '@/components/brand-loader';
import { BlogCard, Screen, SectionHeading, SiteHeader } from '@/components/storefront';
import { fetchBlogPosts } from '@/lib/api';

export default function BlogListScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <BrandLoader subtitle="Loading blog posts" />;
  }

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
