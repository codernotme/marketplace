'use client';

import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const DashboardSidebar = ({ role }: { role: 'vendor' | 'customer' | 'admin' }) => {
  const { logout } = useAuthStore();
  const pathname = usePathname();

  const vendorLinks = [
    { name: 'Dashboard', href: '/vendor/dashboard', icon: 'lucide:layout-dashboard' },
    { name: 'Products', href: '/vendor/products', icon: 'lucide:package' },
    { name: 'Orders', href: '/vendor/orders', icon: 'lucide:shopping-cart' },
    { name: 'Settings', href: '/vendor/settings', icon: 'lucide:settings' },
  ];

  const userLinks = [
    { name: 'Order History', href: '/user/orders', icon: 'lucide:clock' },
    { name: 'Wishlist', href: '/wishlist', icon: 'lucide:heart' },
    { name: 'Profile', href: '/user/profile', icon: 'lucide:user' },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'lucide:bar-chart-2' },
    { name: 'Users', href: '/admin/users', icon: 'lucide:users' },
    { name: 'Platform Settings', href: '/admin/settings', icon: 'lucide:settings' },
  ];

  let links = userLinks;
  let title = 'My Account';
  let accent = 'text-[--c-secondary]';

  if (role === 'vendor') {
    links = vendorLinks;
    title = 'Vendor Portal';
  } else if (role === 'admin') {
    links = adminLinks;
    title = 'Admin Portal';
    accent = 'text-[--c-warning]';
  }

  return (
    <div className="w-64 flex-shrink-0 min-h-[calc(100vh-64px)] bg-white border-r border-[--c-border] flex flex-col pt-8">
      <div className={`px-6 mb-8 text-sm font-medium tracking-[0.15em] uppercase ${accent}`}>
        {title}
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 h-11 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-[--c-primary] text-white font-medium shadow-md' : 'text-[--c-secondary] hover:bg-[--c-surface] hover:text-[--c-primary]'}`}
            >
              <Icon icon={link.icon} className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[--c-border]">
        <Button 
          variant="light" 
          onPress={logout} 
          className="w-full justify-start text-[--c-danger] hover:bg-danger-50 px-4 h-11 text-sm font-medium transition-colors"
          startContent={<Icon icon="lucide:log-out" className="w-4 h-4" />}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};
