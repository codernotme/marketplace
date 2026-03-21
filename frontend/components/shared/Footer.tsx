import Link from 'next/link';
import { Icon } from '@iconify/react';

export const Footer = () => {
  const currentYear = 2026; // Fixed year to avoid hydration mismatch with new Date()

  return (
    <footer className="w-full bg-black text-white pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="font-display font-bold text-2xl tracking-tighter text-white flex items-center gap-1.5 mb-4">
            <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
              <span className="text-black text-sm font-bold">tm.</span>
            </div>
            themrktplace
          </Link>
          <p className="text-gray-400 font-body text-sm leading-relaxed max-w-sm mb-6">
            The most innovative store for curated essentials. Authentic products, premium quality, delivered to your door.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3">
            {[
              { icon: 'mdi:instagram', href: '#' },
              { icon: 'simple-icons:x', href: '#' }, // X (formerly Twitter)
              { icon: 'mdi:facebook', href: '#' },
              { icon: 'mdi:youtube', href: '#' },
            ].map((s) => (
              <a
                key={s.icon}
                href={s.href}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:text-black transition-all hover:scale-110"
              >
                <Icon icon={s.icon} className="text-base" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-display text-base font-semibold mb-5">Shop</h4>
          <ul className="flex flex-col gap-3 text-gray-400 font-body text-sm">
            {[
              { label: 'All Products', href: '/products' },
              { label: 'Menswear', href: '/category/men' },
              { label: 'Womenswear', href: '/category/women' },
              { label: 'Electronics', href: '/category/electronics' },
              { label: 'Footwear', href: '/category/footwear' },
              { label: 'Home & Living', href: '/category/home' },
            ].map(l => (
              <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors hover:translate-x-1 inline-block">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Help & Company */}
        <div>
          <h4 className="font-display text-base font-semibold mb-5">Help & Company</h4>
          <ul className="flex flex-col gap-3 text-gray-400 font-body text-sm">
            {[
              { label: 'FAQs', href: '/faq' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'About Us', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Refund Policy', href: '/refund' },
              { label: 'Terms & Conditions', href: '/terms' },
            ].map(l => (
              <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors hover:translate-x-1 inline-block">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="max-w-7xl mx-auto bg-white/5 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
        <div className="flex-1">
          <p className="font-body font-bold text-sm text-white mb-0.5">Stay in the loop</p>
          <p className="font-body text-xs text-gray-500">Get deals & new arrivals straight to your inbox.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 sm:w-52 bg-white/10 border border-white/10 text-white placeholder:text-gray-600 rounded-full px-4 h-9 text-xs font-body outline-none focus:border-[#84D347] transition-colors"
          />
          <button className="bg-black text-black font-bold rounded-full px-5 h-9 text-xs font-body hover:scale-105 transition-transform flex-shrink-0">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 font-body text-xs">
        <p>© {currentYear} themrktplace. All rights reserved.</p>
        <a
          href="https://tacklestudioz.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-600 hover:text-[#84D347] transition-colors"
        >
          Crafted by <span className="font-bold text-gray-400 hover:text-[#84D347]">tacklestudioz</span>
          <Icon icon="lucide:external-link" className="text-[10px]" />
        </a>
        <div className="flex items-center gap-4">
          <span>English (US)</span>
          <span>USD ($)</span>
        </div>
      </div>
    </footer>
  );
};
