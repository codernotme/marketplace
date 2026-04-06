import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import { fetchBlogPosts } from '@/lib/api';
import Link from 'next/link';
export default async function BlogPage() {
  const posts = await fetchBlogPosts();
  const featuredPost = posts.find(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-black py-20">
        <PageWrapper>
          <div className="max-w-2xl">
            <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-3">The Journal</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">Stories, Trends<br />&amp; Inspiration</h1>
            <p className="font-body text-gray-400 text-lg">Stay ahead of the curve with the latest in fashion, tech, and lifestyle.</p>
          </div>
        </PageWrapper>
      </section>

      <PageWrapper>
        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16 border-b border-gray-100">
            <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="relative h-[340px] rounded-3xl overflow-hidden">
                <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">Featured</span>
              </div>
              <div>
                <span className="font-body text-xs font-bold uppercase tracking-widest text-[#84D347] mb-3 block">{featuredPost.category}</span>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-black mb-4 group-hover:text-[#84D347] transition-colors">{featuredPost.title}</h2>
                <p className="font-body text-gray-500 leading-relaxed mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-3">
                  <img src={featuredPost.avatar} alt={featuredPost.author} className="w-9 h-9 rounded-full" />
                  <div>
                    <p className="font-bold text-black text-sm">{featuredPost.author}</p>
                    <p className="text-xs text-gray-400">{new Date(featuredPost.publishedAt).toLocaleDateString()} · {featuredPost.readTime}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-black font-bold text-sm group-hover:text-[#84D347] transition-colors">
                    Read Article <Icon icon="lucide:arrow-right" />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl font-bold text-black">Latest Articles</h2>
            <div className="flex gap-2">
              {['All', 'Fashion', 'Electronics', 'Lifestyle', 'Home'].map((tag, i) => (
                <button key={tag} className={`font-body text-sm font-semibold px-4 py-2 rounded-full transition-colors ${i === 0 ? 'bg-black text-white' : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
                <div className="relative h-[220px] rounded-3xl overflow-hidden mb-5">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
                </div>
                <span className="font-body text-xs text-gray-400 mb-2">{new Date(post.publishedAt).toLocaleDateString()} · {post.readTime}</span>
                <h3 className="font-display text-xl font-bold text-black mb-2 group-hover:text-[#84D347] transition-colors line-clamp-2">{post.title}</h3>
                <p className="font-body text-gray-500 text-sm leading-relaxed flex-1 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full" />
                  <span className="font-body font-semibold text-sm text-black">{post.author}</span>
                  <span className="ml-auto">
                    <Icon icon="lucide:arrow-up-right" className="text-gray-300 group-hover:text-black transition-colors text-xl" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="pb-24">
          <div className="bg-black rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">Subscribe to The Journal</h2>
              <p className="font-body text-gray-400 text-sm">Get weekly articles, style guides, and exclusive deals in your inbox.</p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <input type="email" placeholder="Enter your email..." className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-500 rounded-full px-6 h-12 outline-none focus:border-[#84D347] transition-colors font-body text-sm" />
              <button className="bg-[#84D347] text-black font-bold rounded-full px-6 h-12 font-body text-sm hover:scale-105 transition-transform flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </PageWrapper>
    </div>
  );
}
