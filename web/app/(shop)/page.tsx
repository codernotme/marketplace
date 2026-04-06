import { fetchProducts, fetchCategories, fetchStorefrontContent } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default async function HomePage() {
  const [products, categories, content] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchStorefrontContent(),
  ]);
  const featuredProducts = products.filter(p => p.is_featured);
  const trendingProducts = products.filter(p => p.is_trending);
  const newArrivals = products.filter(p => p.is_new);

  const homeContent = content.home;
  const hero = homeContent.hero;
  const marqueeItems = homeContent.marqueeItems;

  return (
    <div className="flex flex-col w-full bg-white">

      {/* === HERO SECTION === */}
      <section className="relative bg-black overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-40">
          <img src={hero.image} alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <PageWrapper>
          <div className="relative z-10 py-24 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
              <span className="text-white text-sm font-semibold font-body">{hero.badge}</span>
            </div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-none mb-6">
              {hero.titleLead}<br /><span className="text-[#84D347]">{hero.titleHighlight}</span><br />{hero.titleTail}
            </h1>
            <p className="font-body text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
              {hero.description}
            </p>
            <div className="flex gap-4">
              <Link href={hero.primaryCta.href} className="bg-white text-black font-bold rounded-full px-8 h-14 flex items-center gap-2 hover:scale-105 transition-transform shadow-lg font-body text-sm">
                {hero.primaryCta.label} <Icon icon="lucide:arrow-right" />
              </Link>
              <Link href={hero.secondaryCta.href} className="border border-white/30 text-white font-bold rounded-full px-8 h-14 flex items-center gap-2 hover:bg-white/10 transition-colors font-body text-sm">
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </PageWrapper>

        {/* Floating stat cards */}
        <div className="absolute bottom-10 right-8 hidden lg:flex flex-col gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white">
            <p className="text-3xl font-bold font-display">{hero.stats[0].value}</p>
            <p className="text-sm text-gray-300 font-body">{hero.stats[0].label}</p>
          </div>
          <div className="bg-[#84D347]/90 backdrop-blur-md rounded-2xl p-4 text-black">
            <p className="text-3xl font-bold font-display">{hero.stats[1].value}</p>
            <p className="text-sm font-bold font-body">{hero.stats[1].label}</p>
          </div>
        </div>
      </section>

      {/* === MARQUEE TICKER === */}
      <div className="bg-[#84D347] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-display font-bold text-black text-sm uppercase tracking-widest mx-8 flex items-center gap-3">
              <Icon icon="mdi:star-four-points" className="text-black/40" /> {item}
            </span>
          ))}
        </div>
      </div>

      <PageWrapper>
        {/* === CATEGORIES GRID === */}
        <section className="py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1 font-body">{homeContent.sections.categories.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold text-black tracking-tight">{homeContent.sections.categories.title}</h2>
            </div>
            <Link href="/products" className="font-body text-sm font-semibold text-gray-400 hover:text-black transition-colors flex items-center gap-1">
              {homeContent.sections.categories.action} <Icon icon="lucide:chevron-right" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="group relative rounded-3xl overflow-hidden aspect-square bg-[#F5F5F5] flex flex-col items-center justify-end p-4 cursor-pointer">
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-70 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="relative z-10 text-center">
                  <p className="font-display font-bold text-white text-base leading-tight">{cat.name}</p>
                  <p className="font-body text-white/70 text-xs mt-0.5">{cat.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* === TRENDING PRODUCTS === */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1 font-body">{homeContent.sections.trending.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold text-black tracking-tight">{homeContent.sections.trending.title}</h2>
            </div>
            <Link href="/products" className="font-body text-sm font-semibold text-gray-400 hover:text-black transition-colors flex items-center gap-1">
              {homeContent.sections.trending.action} <Icon icon="lucide:chevron-right" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {trendingProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* === FEATURE BANNER === */}
        <section className="pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deal of the day */}
            <div className="relative bg-black rounded-3xl overflow-hidden p-10 flex flex-col justify-between min-h-[300px]">
              <img src={homeContent.deal.image} alt="Deal" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-transparent" />
              <div className="relative z-10">
                <span className="bg-[#84D347] text-black text-xs font-bold px-3 py-1.5 rounded-full inline-block mb-4">{homeContent.deal.badge}</span>
                <h3 className="font-display text-3xl font-bold text-white mb-2">{homeContent.deal.title}</h3>
                <p className="font-body text-gray-300 text-sm mb-6">{homeContent.deal.description}</p>
                <Link href={homeContent.deal.ctaHref} className="bg-white text-black font-bold rounded-full px-6 h-11 flex items-center w-fit gap-2 hover:scale-105 transition-transform font-body text-sm">
                  {homeContent.deal.ctaLabel} <Icon icon="lucide:arrow-right" />
                </Link>
              </div>
              <div className="relative z-10 flex gap-4 mt-6">
                {homeContent.deal.timerValues.map((num, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                    <p className="text-white font-bold text-xl font-display">{num}</p>
                    <p className="text-white/60 text-[10px] font-body">{homeContent.deal.timerUnits[i]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* New Arrivals quick-grid */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold text-black">New Arrivals</h3>
                <Link href="/products?filter=new" className="font-body text-xs font-semibold text-gray-400 hover:text-black">See All</Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {newArrivals.slice(0, 4).map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group flex gap-3 items-center p-3 bg-[#F5F5F5] rounded-2xl hover:shadow-md transition-all">
                    <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 overflow-hidden">
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-body font-semibold text-black text-sm line-clamp-1 group-hover:text-[#84D347] transition-colors">{product.title}</p>
                      <p className="font-display font-bold text-black text-base mt-0.5">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === FEATURED PRODUCTS === */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1 font-body">{homeContent.sections.featured.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold text-black tracking-tight">{homeContent.sections.featured.title}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* === TESTIMONIALS === */}
        <section className="pb-20">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1 font-body">{homeContent.sections.reviews.eyebrow}</p>
            <h2 className="font-display text-4xl font-bold text-black tracking-tight">{homeContent.sections.reviews.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeContent.testimonials.map((review, i) => (
              <div key={i} className="bg-[#F5F5F5] rounded-3xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Icon key={s} icon="mdi:star" className={s < review.rating ? "text-[#FFB800] text-lg" : "text-gray-200 text-lg"} />
                  ))}
                </div>
                <p className="font-body text-gray-700 text-sm leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-black text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400 font-body">Purchased: {review.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === NEWSLETTER SECTION === */}
        <section className="mb-24">
          <div className="bg-black rounded-3xl p-8 md:p-14 flex flex-col gap-8">
            <div>
              <p className="font-body font-bold text-xs uppercase tracking-widest text-[#84D347] mb-3">{homeContent.newsletter.eyebrow}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{homeContent.newsletter.title}</h2>
              <p className="font-body text-gray-400 text-sm max-w-lg">{homeContent.newsletter.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
              <input
                type="email"
                placeholder={homeContent.newsletter.inputPlaceholder}
                className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-2xl px-6 h-14 outline-none focus:border-[#84D347] focus:ring-1 focus:ring-[#84D347] transition-all font-body text-sm"
              />
              <button className="bg-[#84D347] text-black font-black rounded-2xl px-10 h-14 font-body text-sm hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex-shrink-0 shadow-[0_8px_30px_rgb(132,211,71,0.3)]">
                {homeContent.newsletter.ctaLabel}
              </button>
            </div>
            <p className="font-body text-xs text-gray-600">{homeContent.newsletter.footnote}</p>
          </div>
        </section>

      </PageWrapper>
    </div>
  );
}
