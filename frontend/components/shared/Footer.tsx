import Link from 'next/link';
import { Icon } from '@iconify/react';

export const Footer = () => {
    return (
        <footer className="w-full bg-black text-white pt-16 pb-8 px-6 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="font-display font-bold text-3xl tracking-tight text-white flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-[#84D347] rounded-lg flex items-center justify-center">
                            <Icon icon="mdi:shopping" className="text-white text-xl" />
                        </div>
                        themrktplace
                    </Link>
                    <p className="text-gray-400 font-body text-sm leading-relaxed max-w-sm mb-6">
                        The most innovative mobile store for all your daily curated essentials. High quality, authentic products delivered at your doorstep.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#84D347] hover:text-black transition-colors"><Icon icon="mdi:instagram" className="text-lg" /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#84D347] hover:text-black transition-colors"><Icon icon="mdi:twitter" className="text-lg" /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#84D347] hover:text-black transition-colors"><Icon icon="mdi:facebook" className="text-lg" /></a>
                    </div>
                </div>

                <div>
                    <h4 className="font-display text-lg font-semibold mb-6">Shop</h4>
                    <ul className="flex flex-col gap-4 text-gray-400 font-body text-sm">
                        <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                        <li><Link href="/category/men" className="hover:text-white transition-colors">Menswear</Link></li>
                        <li><Link href="/category/women" className="hover:text-white transition-colors">Womenswear</Link></li>
                        <li><Link href="/category/electronics" className="hover:text-white transition-colors">Electronics</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-display text-lg font-semibold mb-6">Customer Service</h4>
                    <ul className="flex flex-col gap-4 text-gray-400 font-body text-sm">
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 font-body text-xs">
                <p>© {new Date().getFullYear()} themrktplace Inc. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <span>English (US)</span>
                    <span>USD ($)</span>
                </div>
            </div>
        </footer>
    );
};
