'use client';

import { useState } from 'react';

import { useAuthStore } from '@/store/auth.store';

export default function AccountProfilePage() {
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || 'Ava',
    lastName: user?.name?.split(' ').slice(1).join(' ') || 'Sterling',
    email: user?.email || 'ava@example.com',
    phone: '+1 555 010 7788',
    city: 'San Francisco',
    country: 'United States',
  });

  return (
    <div className="animate-in fade-in duration-300">
      <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Profile</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight mb-6">Personal Information</h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold text-black block mb-2">First Name</label>
            <input
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              className="w-full h-11 rounded-xl bg-[#F5F5F5] border-2 border-transparent px-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-black block mb-2">Last Name</label>
            <input
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              className="w-full h-11 rounded-xl bg-[#F5F5F5] border-2 border-transparent px-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-black block mb-2">Email</label>
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full h-11 rounded-xl bg-[#F5F5F5] border-2 border-transparent px-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-black block mb-2">Phone</label>
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full h-11 rounded-xl bg-[#F5F5F5] border-2 border-transparent px-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-black block mb-2">City</label>
            <input
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              className="w-full h-11 rounded-xl bg-[#F5F5F5] border-2 border-transparent px-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-black block mb-2">Country</label>
            <input
              value={form.country}
              onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
              className="w-full h-11 rounded-xl bg-[#F5F5F5] border-2 border-transparent px-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button className="h-11 px-6 rounded-full bg-black text-white font-semibold text-sm">Save Changes</button>
          <button className="h-11 px-6 rounded-full border border-gray-200 text-black font-semibold text-sm hover:border-black transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
