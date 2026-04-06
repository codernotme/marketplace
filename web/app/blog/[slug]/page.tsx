import { Icon } from '@iconify/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { fetchBlogPostBySlug, fetchRelatedBlogPosts, fetchStorefrontContent } from '@/lib/api';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [post, relatedPosts, content] = await Promise.all([
    fetchBlogPostBySlug(slug),
    fetchRelatedBlogPosts(slug, 3),
    fetchStorefrontContent(),
  ]);

  const detailContent = content.blog.detail;

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-6">
          <Icon icon="lucide:arrow-left" /> {detailContent.backLabel}
        </Link>

        <p className="text-xs uppercase tracking-widest font-bold text-[#84D347] mb-2">{post.category}</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-black tracking-tight mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 mb-8">
          <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full" />
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-black">{post.author}</span> -{' '}
            {new Date(post.publishedAt).toLocaleDateString()} - {post.readTime}
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-[260px] md:h-[420px] object-cover" />
        </div>

        <div className="space-y-5 text-gray-700 leading-relaxed mb-10">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag) => (
            <span key={tag} className="h-8 px-3 rounded-full bg-[#F5F5F5] text-sm font-semibold text-gray-600 inline-flex items-center">
              #{tag}
            </span>
          ))}
        </div>

        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-black">{detailContent.relatedHeading}</h2>
            <Link href="/blog" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
              {detailContent.relatedActionLabel}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map((item) => (
              <Link key={item.id} href={`/blog/${item.slug}`} className="group">
                <div className="rounded-2xl overflow-hidden mb-3">
                  <img src={item.image} alt={item.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">{item.category}</p>
                <h3 className="font-display text-xl font-bold text-black group-hover:text-[#84D347] transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
