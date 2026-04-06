'use client';

import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

import { CustomerAddress, fetchCustomerAddresses } from '@/lib/api';

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);

  useEffect(() => {
    fetchCustomerAddresses().then(setAddresses);
  }, []);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Addresses</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight">Saved Addresses</h1>
        </div>
        <button className="h-10 px-5 rounded-full bg-black text-white text-sm font-semibold inline-flex items-center gap-2">
          <Icon icon="mdi:plus" /> Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-6 px-3 rounded-full bg-[#F5F5F5] text-xs font-bold uppercase text-gray-600 flex items-center">
                  {address.label}
                </span>
                {address.isDefault && (
                  <span className="h-6 px-3 rounded-full bg-[#84D347] text-xs font-bold text-black flex items-center">Default</span>
                )}
              </div>
              <button className="text-gray-500 hover:text-black transition-colors text-sm font-semibold">Edit</button>
            </div>

            <p className="text-sm text-black font-semibold">{address.fullName}</p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ''}
              <br />
              {address.city}, {address.state} {address.pincode}
              <br />
              {address.country}
              <br />
              {address.phone}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <button className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">Set as default</button>
              <button
                className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                onClick={() => setAddresses((prev) => prev.filter((item) => item.id !== address.id))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
