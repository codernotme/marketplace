'use client';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { storefrontContent } from '@/data/mock';

const faqContent = storefrontContent.faq;
const categories = faqContent.categories;

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${open ? 'shadow-sm' : ''}`}>
      <button
        className="w-full text-left flex items-center justify-between gap-4 p-5 hover:bg-[#F9F9F9] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-body font-semibold text-sm text-black">{q}</span>
        <div className={`w-7 h-7 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 transition-all ${open ? 'bg-black' : ''}`}>
          <Icon icon={open ? 'mdi:minus' : 'mdi:plus'} className={`text-sm ${open ? 'text-white' : 'text-black'}`} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="font-body text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'orders');
  const current = categories.find(c => c.id === activeCategory)!;

  return (
    <div className="bg-white min-h-screen font-body">
      {/* Hero */}
      <div className="bg-black px-6 py-20 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-[#84D347] mb-3">{faqContent.hero.eyebrow}</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-4">{faqContent.hero.title}</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">{faqContent.hero.description}</p>
        <div className="max-w-md mx-auto relative">
          <Icon icon="mdi:magnify" className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder={faqContent.hero.searchPlaceholder}
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 rounded-full pl-12 pr-5 h-12 outline-none focus:border-[#84D347] transition-colors font-body text-sm"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Category tabs */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-body font-semibold text-sm transition-all ${activeCategory === cat.id ? 'bg-black text-white shadow-sm' : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200'}`}
            >
              <Icon icon={cat.icon} className="text-base" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="flex flex-col gap-3 mb-16">
          {current.faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* Still need help? */}
        <div className="bg-[#F5F5F5] rounded-3xl p-10 text-center">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Icon icon="mdi:headset" className="text-white text-2xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-black mb-2">{faqContent.support.title}</h2>
          <p className="font-body text-gray-500 text-sm max-w-md mx-auto mb-7">{faqContent.support.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-black text-white font-bold rounded-full px-8 h-12 inline-flex items-center gap-2 hover:scale-105 transition-transform">
              <Icon icon="mdi:message-outline" /> {faqContent.support.messageLabel}
            </Link>
            <a href="mailto:support@themrktplace.com" className="border-2 border-gray-200 text-black font-bold rounded-full px-8 h-12 inline-flex items-center gap-2 hover:border-black transition-colors">
              <Icon icon="mdi:email-outline" /> {faqContent.support.emailLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
