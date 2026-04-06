'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = { name: string; href: string; icon: string };

const userLinks: NavLink[] = [
  { name: 'Order History', href: '/user/orders', icon: 'mdi:shopping-outline' },
  { name: 'Wishlist', href: '/wishlist', icon: 'mdi:heart-outline' },
  { name: 'Profile & Settings', href: '/user/profile', icon: 'mdi:account-circle-outline' },
  { name: 'Addresses', href: '/user/profile', icon: 'mdi:map-marker-outline' },
];

const vendorLinks: NavLink[] = [
  { name: 'Overview', href: '/vendor/dashboard', icon: 'mdi:view-dashboard-outline' },
  { name: 'My Products', href: '/vendor/products', icon: 'mdi:package-variant-outline' },
  { name: 'Add Product', href: '/vendor/products/new', icon: 'mdi:plus-box-outline' },
  { name: 'Orders', href: '/vendor/dashboard', icon: 'mdi:clipboard-list-outline' },
  { name: 'Analytics', href: '/vendor/dashboard', icon: 'mdi:chart-line' },
  { name: 'Settings', href: '/vendor/dashboard', icon: 'mdi:cog-outline' },
];

const adminLinks: NavLink[] = [
  { name: 'Overview', href: '/admin/dashboard', icon: 'mdi:view-dashboard-outline' },
  { name: 'Users', href: '/admin/users', icon: 'mdi:account-group-outline' },
  { name: 'Vendors', href: '/admin/dashboard', icon: 'mdi:storefront-outline' },
  { name: 'Orders', href: '/admin/dashboard', icon: 'mdi:clipboard-list-outline' },
  { name: 'Analytics', href: '/admin/dashboard', icon: 'mdi:chart-bar' },
  { name: 'Platform Settings', href: '/admin/dashboard', icon: 'mdi:cog-outline' },
];

const roleConfig = {
  customer: { links: userLinks, label: 'My Account', accent: 'text-black', avatarBg: 'bg-[#F5F5F5]' },
  vendor: { links: vendorLinks, label: 'Vendor Portal', accent: 'text-[#84D347]', avatarBg: 'bg-black/10' },
  admin: { links: adminLinks, label: 'Admin', accent: 'text-amber-600', avatarBg: 'bg-amber-50' },
};

export const DashboardSidebar = ({ role }: { role: 'vendor' | 'customer' | 'admin' }) => {
  const pathname = usePathname();
  const { links, label, accent, avatarBg } = roleConfig[role];

  return (
    <div className="w-64 flex-shrink-0 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* User Card */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${avatarBg} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            <img src="https://i.pravatar.cc/40?img=47" alt="User" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-black truncate">Ava Sterling</p>
            <p className={`font-body text-xs font-bold uppercase tracking-widest ${accent}`}>{label}</p>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-2 font-body text-xs text-gray-400 hover:text-black transition-colors">
          <Icon icon="lucide:arrow-left" className="text-xs" /> Back to Store
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 h-11 rounded-xl font-body font-semibold text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-500 hover:bg-[#F5F5F5] hover:text-black'
              }`}
            >
              <Icon icon={link.icon} className={`text-lg flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
              <span className="truncate">{link.name}</span>
              {isActive && <Icon icon="lucide:chevron-right" className="ml-auto text-white/50 text-xs" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Sign out */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-4 h-11 rounded-xl font-body font-semibold text-sm text-red-500 hover:bg-red-50 transition-colors">
          <Icon icon="mdi:logout" className="text-lg" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
