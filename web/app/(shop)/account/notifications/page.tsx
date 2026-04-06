'use client';

import { useEffect, useState } from 'react';

import { NotificationRecord, fetchNotifications } from '@/lib/api';

interface Preferences {
  orderUpdates: boolean;
  promotions: boolean;
  wishlistDrops: boolean;
  newsletter: boolean;
}

export default function AccountNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    orderUpdates: true,
    promotions: true,
    wishlistDrops: true,
    newsletter: false,
  });

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  return (
    <div className="animate-in fade-in duration-300">
      <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Notifications</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight mb-6">Alerts & Preferences</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-display text-2xl font-bold text-black mb-5">Notification Feed</h2>
          <div className="space-y-3">
            {notifications.map((item) => (
              <article key={item.id} className="rounded-xl bg-[#F5F5F5] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-black">{item.title}</p>
                  {!item.read && <span className="w-2.5 h-2.5 rounded-full bg-[#84D347]" />}
                </div>
                <p className="text-xs text-gray-600 mt-2">{item.body}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleString()}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-display text-2xl font-bold text-black mb-5">Preferences</h2>
          <div className="space-y-3">
            {[
              { key: 'orderUpdates', label: 'Order updates', sub: 'Shipping and delivery alerts' },
              { key: 'promotions', label: 'Promotions', sub: 'Sales and limited-time offers' },
              { key: 'wishlistDrops', label: 'Wishlist price drops', sub: 'When saved items drop in price' },
              { key: 'newsletter', label: 'Weekly newsletter', sub: 'Style guides and product stories' },
            ].map((pref) => {
              const prefKey = pref.key as keyof Preferences;

              return (
                <label key={pref.key} className="flex items-center justify-between gap-3 rounded-xl bg-[#F5F5F5] p-4">
                  <div>
                    <p className="text-sm font-semibold text-black">{pref.label}</p>
                    <p className="text-xs text-gray-500">{pref.sub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreferences((prev) => ({ ...prev, [prefKey]: !prev[prefKey] }))}
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${preferences[prefKey] ? 'bg-black' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                        preferences[prefKey] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
