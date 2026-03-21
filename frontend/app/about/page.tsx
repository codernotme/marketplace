import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '1,200+', label: 'Products Listed' },
    { value: '150+', label: 'Trusted Brands' },
    { value: '4.9★', label: 'Average Rating' },
  ];

  const team = [
    { name: 'Ava Sterling', role: 'Co-Founder & CEO', avatar: 'https://i.pravatar.cc/200?img=47' },
    { name: 'James Hurst', role: 'Co-Founder & CPO', avatar: 'https://i.pravatar.cc/200?img=15' },
    { name: 'Sofia Reyes', role: 'Head of Design', avatar: 'https://i.pravatar.cc/200?img=5' },
    { name: 'Marcus Lee', role: 'Head of Engineering', avatar: 'https://i.pravatar.cc/200?img=11' },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden h-[60vh] flex items-center">
        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80" alt="About" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <PageWrapper>
          <div className="relative z-10 max-w-2xl">
            <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-3">Our Story</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight">We are<br /><span className="text-[#84D347]">themrktplace</span></h1>
            <p className="font-body text-gray-300 text-lg mt-4 max-w-lg">Building the world's most curated multi-category marketplace, connecting people with products that matter.</p>
          </div>
        </PageWrapper>
      </section>

      <PageWrapper>
        {/* Stats */}
        <section className="py-16 border-b border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
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
              <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-3">Our Mission</p>
              <h2 className="font-display text-4xl font-bold text-black tracking-tight mb-6">Authentic products,<br />delivered beautifully.</h2>
              <p className="font-body text-gray-500 leading-relaxed mb-4">
                We started <strong>themrktplace</strong> with a simple idea: online shopping should feel just as premium as shopping in a boutique. Every brand we partner with is vetted for quality, authenticity, and values alignment.
              </p>
              <p className="font-body text-gray-500 leading-relaxed mb-8">
                From fashion to electronics, home goods to accessories — every category on our platform reflects our commitment to curated excellence.
              </p>
              <Link href="/products" className="bg-black text-white font-bold rounded-full px-8 h-12 flex items-center w-fit gap-2 hover:scale-105 transition-transform font-body text-sm">
                Explore the Collection <Icon icon="lucide:arrow-right" />
              </Link>
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80" alt="Mission" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="pb-20">
          <div className="text-center mb-12">
            <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-2">What We Believe</p>
            <h2 className="font-display text-4xl font-bold text-black tracking-tight">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'mdi:shield-star-outline', title: 'Authenticity', text: 'Every product is verified and comes directly from authorized sellers and trusted brands.' },
              { icon: 'mdi:leaf-circle-outline', title: 'Sustainability', text: 'We prioritize brands committed to ethical production and sustainable materials.' },
              { icon: 'mdi:heart-circle-outline', title: 'Community', text: 'We foster a community of shoppers, sellers, and creators who share a love for quality.' },
            ].map((val) => (
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
            <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-2">Behind the Scenes</p>
            <h2 className="font-display text-4xl font-bold text-black tracking-tight">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
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
              <h2 className="font-display text-3xl font-bold text-white mb-2">Ready to start shopping?</h2>
              <p className="font-body text-gray-400 text-sm">Explore thousands of curated products across all categories.</p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <Link href="/products" className="bg-black text-black font-bold rounded-full px-8 h-14 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform">
                Shop Now <Icon icon="lucide:arrow-right" />
              </Link>
              <Link href="/contact" className="border border-white/30 text-white font-bold rounded-full px-8 h-14 flex items-center font-body text-sm hover:bg-white/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </PageWrapper>
    </div>
  );
}
