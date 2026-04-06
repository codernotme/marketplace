import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { fetchStorefrontContent } from '@/lib/api';

export default async function TermsPage() {
  const content = await fetchStorefrontContent();
  const terms = content.legal.terms;
  const sections = terms.sections;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-black py-16">
        <PageWrapper>
          <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-3">{terms.hero.eyebrow}</p>
          <h1 className="font-display text-5xl font-bold text-white tracking-tight mb-3">{terms.hero.title}</h1>
          <p className="font-body text-gray-400">{terms.hero.updatedAt}</p>
        </PageWrapper>
      </section>

      <PageWrapper>
        <div className="py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-[#F5F5F5] rounded-3xl p-6">
              <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-4">{terms.tocTitle}</p>
              <nav className="flex flex-col gap-2">
                {sections.map((s, i) => (
                  <a key={i} href={`#section-${i}`} className="font-body text-sm text-gray-500 hover:text-black transition-colors py-1 border-l-2 border-transparent hover:border-[#84D347] pl-3">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#F5F5F5] rounded-3xl p-8 mb-8">
              <div className="flex items-start gap-4">
                <Icon icon="mdi:information-outline" className="text-2xl text-[#84D347] flex-shrink-0 mt-0.5" />
                <p className="font-body text-gray-600 text-sm leading-relaxed">{terms.notice}</p>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              {sections.map((section, i) => (
                <div key={i} id={`section-${i}`} className="scroll-mt-24">
                  <h2 className="font-display text-xl font-bold text-black mb-3">{section.title}</h2>
                  <p className="font-body text-gray-600 leading-relaxed text-[15px]">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Footer contact */}
            <div className="mt-12 bg-black rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div>
                <h3 className="font-display font-bold text-white text-xl mb-1">{terms.cta.title}</h3>
                <p className="font-body text-gray-400 text-sm">{terms.cta.description}</p>
              </div>
              <Link href={terms.cta.href} className="bg-black text-black font-bold rounded-full px-6 h-11 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform flex-shrink-0">
                {terms.cta.label} <Icon icon="lucide:arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
