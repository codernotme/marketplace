import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { fetchStorefrontContent } from '@/lib/api';

export default async function AboutPage() {
  const content = await fetchStorefrontContent();
  const about = content.about;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden h-[60vh] flex items-center">
        <img src={about.hero.image} alt="About" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <PageWrapper>
          <div className="relative z-10 max-w-2xl">
            <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-3">{about.hero.eyebrow}</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight">{about.hero.titleLead}<br /><span className="text-[#84D347]">{about.hero.titleHighlight}</span></h1>
            <p className="font-body text-gray-300 text-lg mt-4 max-w-lg">{about.hero.description}</p>
          </div>
        </PageWrapper>
      </section>

      <PageWrapper>
        {/* Stats */}
        <section className="py-16 border-b border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {about.stats.map((stat: any) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-5xl font-black text-black mb-2">{stat.value}</p>
                <p className="font-body text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-3">{about.mission.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold text-black tracking-tight mb-6">{about.mission.titleLead}<br />{about.mission.titleTail}</h2>
              <p className="font-body text-gray-500 leading-relaxed mb-4">
                {about.mission.body[0]}
              </p>
              <p className="font-body text-gray-500 leading-relaxed mb-8">
                {about.mission.body[1]}
              </p>
              <Link href={about.mission.ctaHref} className="bg-black text-white font-bold rounded-full px-8 h-12 flex items-center w-fit gap-2 hover:scale-105 transition-transform font-body text-sm">
                {about.mission.ctaLabel} <Icon icon="lucide:arrow-right" />
              </Link>
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden">
              <img src={about.mission.image} alt="Mission" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="pb-20">
          <div className="text-center mb-12">
            <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-2">{about.values.eyebrow}</p>
            <h2 className="font-display text-4xl font-bold text-black tracking-tight">{about.values.heading}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {about.values.items.map((val: any) => (
              <div key={val.title} className="bg-[#F5F5F5] rounded-3xl p-8">
                <Icon icon={val.icon} className="text-4xl text-[#84D347] mb-4" />
                <h3 className="font-display text-xl font-bold text-black mb-2">{val.title}</h3>
                <p className="font-body text-gray-500 text-sm leading-relaxed">{val.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="pb-20">
          <div className="text-center mb-12">
            <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-2">{about.team.eyebrow}</p>
            <h2 className="font-display text-4xl font-bold text-black tracking-tight">{about.team.heading}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {about.team.members.map((member: any) => (
              <div key={member.name} className="group text-center">
                <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#F5F5F5] mb-4 group-hover:shadow-xl transition-shadow">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-display font-bold text-black">{member.name}</h3>
                <p className="font-body text-sm text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mb-24">
          <div className="bg-black rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">{about.cta.title}</h2>
              <p className="font-body text-gray-400 text-sm">{about.cta.description}</p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <Link href={about.cta.primaryHref} className="bg-black text-black font-bold rounded-full px-8 h-14 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform">
                {about.cta.primaryLabel} <Icon icon="lucide:arrow-right" />
              </Link>
              <Link href={about.cta.secondaryHref} className="border border-white/30 text-white font-bold rounded-full px-8 h-14 flex items-center font-body text-sm hover:bg-white/10 transition-colors">
                {about.cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </section>
      </PageWrapper>
    </div>
  );
}
