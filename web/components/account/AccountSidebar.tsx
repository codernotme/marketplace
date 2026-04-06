'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const accountLinks = [
  { href: '/account', label: 'Overview', icon: 'mdi:view-dashboard-outline' },
  { href: '/account/orders', label: 'My Orders', icon: 'mdi:shopping-outline' },
  { href: '/account/addresses', label: 'Addresses', icon: 'mdi:map-marker-outline' },
  { href: '/account/wishlist', label: 'Wishlist', icon: 'mdi:heart-outline' },
  { href: '/account/notifications', label: 'Notifications', icon: 'mdi:bell-outline' },
  { href: '/account/profile', label: 'Profile', icon: 'mdi:account-outline' },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 lg:sticky lg:top-24 self-start">
      <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-3 pb-2">My Account</p>
        <nav className="flex flex-col gap-1">
          {accountLinks.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 h-11 px-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-[#F5F5F5]'
                }`}
              >
                <Icon icon={item.icon} className="text-lg" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
