'use client';
import { Icon } from '@iconify/react';
import { useState } from 'react';

const mockUsers = [
  { id: 'u1', name: 'Alexa Watson', email: 'alexa@example.com', role: 'Customer', joined: 'Jan 12, 2026', status: 'Active', avatar: 'https://i.pravatar.cc/40?img=1', orders: 12 },
  { id: 'u2', name: 'Sofia Reyes', email: 'sofia@example.com', role: 'Vendor', joined: 'Feb 03, 2026', status: 'Active', avatar: 'https://i.pravatar.cc/40?img=5', orders: 0 },
  { id: 'u3', name: 'James Hurst', email: 'james@example.com', role: 'Admin', joined: 'Jan 01, 2026', status: 'Active', avatar: 'https://i.pravatar.cc/40?img=15', orders: 0 },
  { id: 'u4', name: 'Emily Mendez', email: 'emily@example.com', role: 'Customer', joined: 'Mar 05, 2026', status: 'Active', avatar: 'https://i.pravatar.cc/40?img=9', orders: 6 },
  { id: 'u5', name: 'David Swagner', email: 'david@example.com', role: 'Customer', joined: 'Feb 20, 2026', status: 'Suspended', avatar: 'https://i.pravatar.cc/40?img=11', orders: 3 },
  { id: 'u6', name: 'Marcus Lee', email: 'marcus@example.com', role: 'Vendor', joined: 'Mar 10, 2026', status: 'Pending', avatar: 'https://i.pravatar.cc/40?img=7', orders: 0 },
];

const roleChip: Record<string, string> = {
  Customer: 'bg-gray-100 text-gray-700',
  Vendor: 'bg-blue-50 text-blue-700',
  Admin: 'bg-[#84D347]/20 text-[#4a8a1a]',
};

const statusChip: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  Suspended: 'bg-red-50 text-red-600',
  Pending: 'bg-amber-50 text-amber-700',
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const roles = ['All', 'Customer', 'Vendor', 'Admin'];

  const filtered = mockUsers.filter(u =>
    (activeRole === 'All' || u.role === activeRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Admin</p>
          <h1 className="font-display text-3xl font-bold text-black">User Management</h1>
        </div>
        <button className="bg-black text-white font-bold rounded-full px-5 h-10 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform">
          <Icon icon="mdi:account-plus-outline" /> Invite User
        </button>
      </div>

      {/* Role Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`font-body text-sm font-semibold px-4 py-2 rounded-full transition-colors ${activeRole === role ? 'bg-black text-white' : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200'}`}
          >
            {role}
            <span className="ml-2 text-xs opacity-60">
              {role === 'All' ? mockUsers.length : mockUsers.filter(u => u.role === role).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icon icon="lucide:search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F5F5F5] rounded-full pl-10 pr-4 h-10 text-sm font-body outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 h-10 font-body text-sm font-semibold text-gray-600 hover:border-black transition-colors">
            <Icon icon="mdi:export" className="text-sm" /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F9F9]">
                {['User', 'Role', 'Joined', 'Orders', 'Status', 'Actions'].map(h => (
                  <th key={h} className="font-body font-bold text-xs uppercase tracking-widest text-gray-400 text-left px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-gray-50 hover:bg-[#F9F9F9] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      <div>
                        <p className="font-body font-semibold text-sm text-black">{user.name}</p>
                        <p className="font-body text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-body font-bold text-xs px-3 py-1 rounded-full ${roleChip[user.role]}`}>{user.role}</span>
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-gray-500">{user.joined}</td>
                  <td className="px-5 py-4 font-display font-bold text-sm text-black">{user.orders}</td>
                  <td className="px-5 py-4">
                    <span className={`font-body font-bold text-xs px-3 py-1 rounded-full ${statusChip[user.status]}`}>{user.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all" title="Edit">
                        <Icon icon="lucide:edit-3" className="text-sm" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all" title="Suspend">
                        <Icon icon="mdi:account-off-outline" className="text-sm" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all" title="Delete">
                        <Icon icon="lucide:trash-2" className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Icon icon="mdi:account-search" className="text-5xl text-gray-200 mx-auto mb-3" />
            <p className="font-body font-semibold text-gray-400">No users match your search</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="font-body text-sm text-gray-400">Showing {filtered.length} of {mockUsers.length} users</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors">
              <Icon icon="lucide:chevron-left" className="text-sm" />
            </button>
            <span className="w-8 h-8 rounded-lg bg-black text-white text-sm font-bold flex items-center justify-center">1</span>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors">
              <Icon icon="lucide:chevron-right" className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
