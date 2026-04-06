'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useState, useEffect } from 'react';
import { storefrontContent } from '@/data/mock';

const categories = storefrontContent.navigation.shopCategories;
const navLinks = storefrontContent.navigation.primaryLinks;
const brand = storefrontContent.brand;
const navContent = storefrontContent.navigation;

export const Navbar = () => {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Detect scroll for shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header className={`sticky top-0 z-50 bg-white font-body transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt={brand.siteName}
              width={88}
              height={34}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            <Link href="/" className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${pathname === '/' ? 'text-black' : 'text-gray-500 hover:text-black hover:bg-[#F5F5F5]'}`}>
              {navContent.desktopHomeLabel}
            </Link>

            {/* Shop / Categories dropdown */}
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${pathname.startsWith('/products') || pathname.startsWith('/category') ? 'text-black' : 'text-gray-500 hover:text-black hover:bg-[#F5F5F5]'}`}>
                {navContent.desktopShopLabel} <Icon icon="lucide:chevron-down" className={`text-xs transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2 w-64 flex flex-col gap-0.5">
                    {categories.map(cat => (
                      <Link key={cat.href} href={cat.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F5F5F5] transition-colors group">
                        <div className="w-8 h-8 bg-[#F5F5F5] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                          <Icon icon={cat.icon} className="text-base" />
                        </div>
                        <span className="font-semibold text-sm text-black">{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map(link => (
              <Link key={link.href} href={link.href} className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${pathname === link.href ? 'text-black' : 'text-gray-500 hover:text-black hover:bg-[#F5F5F5]'}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="search"
                  placeholder={storefrontContent.navigation.searchPlaceholder}
                  className="bg-[#F5F5F5] rounded-full px-5 h-9 text-sm outline-none focus:ring-2 focus:ring-black w-56 transition-all font-body"
                />
                <button title="Close search" aria-label="Close search" onClick={() => setSearchOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5F5F5] text-gray-500">
                  <Icon icon="mdi:close" />
                </button>
              </div>
            ) : (
              <button title="Open search" aria-label="Open search" onClick={() => setSearchOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F5F5] text-gray-600 hover:text-black transition-colors">
                <Icon icon="mdi:magnify" className="text-xl" />
              </button>
            )}
          </div>

          {/* Wishlist (desktop) */}
          <Link href="/wishlist" className="hidden md:flex w-9 h-9 rounded-full items-center justify-center hover:bg-[#F5F5F5] text-gray-600 hover:text-black transition-colors">
            <Icon icon="mdi:heart-outline" className="text-xl" />
          </Link>

          {/* Cart */}
          <button
            onClick={openDrawer}
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F5F5] text-gray-600 hover:text-black transition-colors"
            aria-label="Cart"
          >
            <Icon icon="mdi:cart-outline" className="text-xl" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Auth (desktop) */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2 relative group">
              <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-[#F5F5F5] transition-colors">
                <img src={user?.avatar || 'https://i.pravatar.cc/40?img=47'} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                <span className="font-semibold text-sm text-black max-w-[80px] truncate">{user?.name?.split(' ')[0] || navContent.authLabels.accountShortName}</span>
                <Icon icon="lucide:chevron-down" className="text-xs text-gray-400" />
              </button>
              {/* Dropdown */}
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2 w-48 flex flex-col gap-0.5">
                  {navContent.accountMenuLinks.map(item => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F5F5F5] text-sm font-semibold text-black">
                      <Icon icon={item.icon} className="text-base text-gray-500" /> {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-semibold text-red-500">
                      <Icon icon="mdi:logout" className="text-base" /> {navContent.authLabels.signOut}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex bg-black text-white font-bold text-sm rounded-full px-5 h-9 items-center hover:scale-105 transition-transform">
              {navContent.authLabels.signIn}
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F5F5] transition-colors ml-1"
            aria-label="Open menu"
          >
            <Icon icon="mdi:menu" className="text-2xl text-black" />
          </button>
        </div>
      </header>

      {/* ===== MOBILE DRAWER ===== */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-sm z-[101] bg-white flex flex-col transition-transform duration-300 ease-in-out md:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt={brand.siteName}
              width={88}
              height={34}
              className="h-7 w-auto"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            title="Close menu"
            aria-label="Close menu"
            className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center"
          >
            <Icon icon="mdi:close" className="text-xl text-black" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-5">
          <div className="relative">
            <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="search"
              placeholder={storefrontContent.navigation.searchPlaceholder}
              className="w-full bg-[#F5F5F5] rounded-full pl-11 pr-4 h-11 text-sm font-body outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 pt-4">
          {/* Main links */}
          <div className="flex flex-col gap-0.5 mb-4">
            {[{ label: 'Home', href: '/', icon: 'mdi:home-outline' }, ...navLinks.slice(1).map(l => ({ ...l, icon: l.label === 'Blog' ? 'mdi:newspaper-variant-outline' : l.label === 'About' ? 'mdi:information-outline' : 'mdi:phone-outline' }))].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 h-12 rounded-xl font-semibold text-sm transition-colors ${pathname === link.href ? 'bg-black text-white' : 'text-black hover:bg-[#F5F5F5]'}`}
              >
                <Icon icon={link.icon} className="text-lg flex-shrink-0" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-2">{navContent.mobile.categoriesSectionLabel}</div>

          <div className="flex flex-col gap-0.5 mb-6">
            {categories.map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`flex items-center gap-3 px-4 h-11 rounded-xl font-semibold text-sm transition-colors ${pathname === cat.href ? 'bg-black text-white' : 'text-gray-700 hover:bg-[#F5F5F5]'}`}
              >
                <Icon icon={cat.icon} className="text-base text-[#84D347] flex-shrink-0" />
                {cat.label}
              </Link>
            ))}
          </div>

          {/* User links when auth */}
          {isAuthenticated && (
            <>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-2">{navContent.mobile.accountSectionLabel}</div>
              <div className="flex flex-col gap-0.5">
                {navContent.accountMenuLinks.map(item => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 h-11 rounded-xl font-semibold text-sm text-gray-700 hover:bg-[#F5F5F5] transition-colors">
                    <Icon icon={item.icon} className="text-base flex-shrink-0" /> {item.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-gray-100 flex flex-col gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <img src={user?.avatar || 'https://i.pravatar.cc/40?img=47'} alt="User" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-black truncate">{user?.name || navContent.authLabels.accountFallbackName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button title="Sign out" aria-label="Sign out" onClick={logout} className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center text-red-500 flex-shrink-0">
                <Icon icon="mdi:logout" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="flex-1 h-12 bg-black text-white font-bold rounded-xl flex items-center justify-center text-sm">
                {navContent.authLabels.signIn}
              </Link>
              <Link href="/register" className="flex-1 h-12 border-2 border-gray-100 text-black font-bold rounded-xl flex items-center justify-center text-sm hover:border-black transition-colors">
                {navContent.authLabels.register}
              </Link>
            </div>
          )}
          <div className="flex items-center gap-4 justify-center">
            <Link href="/cart" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition-colors">
              <Icon icon="mdi:cart-outline" /> Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            <span className="w-px h-4 bg-gray-200" />
            <Link href={navContent.mobile.footerLinks[0].href} className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">{navContent.mobile.footerLinks[0].label}</Link>
            <span className="w-px h-4 bg-gray-200" />
            <Link href={navContent.mobile.footerLinks[1].href} className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">{navContent.mobile.footerLinks[1].label}</Link>
          </div>
        </div>
      </div>
    </>
  );
};
