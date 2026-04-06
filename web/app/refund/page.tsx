import Link from 'next/link';
import { Icon } from '@iconify/react';
import { fetchStorefrontContent } from '@/lib/api';

export default async function RefundPage() {
  const content = await fetchStorefrontContent();
  const refund = content.legal.refund;
  const sections = refund.sections;

  return (
    <div className="bg-white min-h-screen font-body">
      {/* Hero */}
      <div className="bg-black px-6 py-20 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-[#84D347] mb-3">{refund.hero.eyebrow}</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-4">{refund.hero.title}</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">{refund.hero.description}</p>
      </div>

      {/* Quick stats bar */}
      <div className="bg-[#F5F5F5] border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-4 text-center">
          {refund.stats.map((item: any) => (
            <div key={item.stat}>
              <Icon icon={item.icon} className="text-2xl text-[#84D347] mx-auto mb-1" />
              <p className="font-display font-bold text-lg text-black">{item.stat}</p>
              <p className="font-body text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Sticky TOC */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24">
            <p className="font-body font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">{refund.tocTitle}</p>
            <nav className="flex flex-col gap-2">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="font-body text-sm text-gray-500 hover:text-black transition-colors py-1 border-l-2 border-transparent hover:border-[#84D347] pl-3">
                  {s.title.split('. ')[1]}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="md:col-span-3 flex flex-col gap-10">
          {sections.map(s => (
            <div key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-display text-xl font-bold text-black mb-3">{s.title}</h2>
              {s.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{para}</p>
              ))}
            </div>
          ))}

          {/* CTA */}
          <div className="bg-black rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="font-display font-bold text-xl text-white mb-1">{refund.cta.title}</p>
              <p className="text-gray-400 text-sm">{refund.cta.description}</p>
            </div>
            <Link href={refund.cta.href} className="bg-black text-black font-bold rounded-full px-7 h-11 inline-flex items-center gap-2 hover:scale-105 transition-transform flex-shrink-0">
              <Icon icon="mdi:message-outline" /> {refund.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
