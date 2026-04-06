'use client';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Settings</p>
        <h1 className="font-display text-3xl font-bold text-black">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 flex flex-col items-center text-center shadow-sm">
            <div className="relative mb-5">
              <img
                src="https://i.pravatar.cc/120?img=47"
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Icon icon="mdi:camera" className="text-white text-sm" />
              </button>
            </div>
            <h2 className="font-display font-bold text-xl text-black mb-1">Ava Sterling</h2>
            <p className="font-body text-gray-400 text-sm mb-5">ava@example.com</p>

            <div className="w-full bg-[#F5F5F5] rounded-2xl px-1 py-1 flex mb-6">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'security', label: 'Security' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-xl font-body font-semibold text-sm transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="w-full space-y-3 text-left">
              {[
                { label: 'Member Since', value: 'Jan 2026' },
                { label: 'Total Orders', value: '12' },
                { label: 'Wishlist Items', value: '8' },
                { label: 'Member Status', value: 'Gold Member' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="font-body text-xs text-gray-400">{item.label}</span>
                  <span className="font-body font-semibold text-sm text-black">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h3 className="font-display font-bold text-xl text-black mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {[
                  { label: 'First Name', placeholder: 'Ava', type: 'text' },
                  { label: 'Last Name', placeholder: 'Sterling', type: 'text' },
                  { label: 'Email Address', placeholder: 'ava@example.com', type: 'email' },
                  { label: 'Phone Number', placeholder: '+1 (555) 000-0000', type: 'tel' },
                  { label: 'City', placeholder: 'San Francisco', type: 'text' },
                  { label: 'Country', placeholder: 'United States', type: 'text' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="font-body font-semibold text-sm text-black block mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.placeholder}
                      className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <label className="font-body font-semibold text-sm text-black block mb-2">Bio</label>
                <textarea rows={3} defaultValue="Fashion enthusiast & tech lover. Shopping since 2026." className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 py-3 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all resize-none" />
              </div>
              <div className="flex gap-4">
                <button className="bg-black text-white font-bold rounded-full px-8 h-12 font-body text-sm hover:scale-[1.02] transition-transform shadow-lg">
                  Save Changes
                </button>
                <button className="border-2 border-gray-100 text-black font-semibold rounded-full px-6 h-12 font-body text-sm hover:border-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h3 className="font-display font-bold text-xl text-black mb-6">Security Settings</h3>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  { icon: 'mdi:lock-outline', title: 'Change Password', sub: 'Last changed 3 months ago', action: 'Update' },
                  { icon: 'mdi:shield-check-outline', title: 'Two-Factor Authentication', sub: 'Currently disabled', action: 'Enable' },
                  { icon: 'mdi:devices', title: 'Active Sessions', sub: '2 active devices', action: 'Manage' },
                ].map(item => (
                  <div key={item.title} className="flex items-center justify-between p-5 rounded-2xl bg-[#F5F5F5] hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Icon icon={item.icon} className="text-black text-lg" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-black text-sm">{item.title}</p>
                        <p className="font-body text-xs text-gray-400">{item.sub}</p>
                      </div>
                    </div>
                    <span className="font-body font-bold text-sm text-black border border-gray-200 px-4 py-1.5 rounded-full group-hover:border-black transition-colors">
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border border-red-100 rounded-2xl p-5">
                <h4 className="font-body font-bold text-red-600 mb-1">Danger Zone</h4>
                <p className="font-body text-gray-500 text-xs mb-4">Permanently delete your account and all associated data.</p>
                <button className="font-body font-bold text-red-600 text-sm border border-red-200 rounded-full px-5 h-9 hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
