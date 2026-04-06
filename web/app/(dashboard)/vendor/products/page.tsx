'use client';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';

const mockProducts = [
  { id: 'p1', title: 'Minimalist Leather Watch', sku: 'SKU-001', price: 189, stock: 10, status: 'Active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=60&q=80' },
  { id: 'p2', title: 'Noise Cancelling Earbuds', sku: 'SKU-002', price: 159, stock: 18, status: 'Active', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=60&q=80' },
  { id: 'p6', title: '65% Mechanical Keyboard', sku: 'SKU-003', price: 129, stock: 4, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=60&q=80' },
  { id: 'p7', title: 'DR CRZ Varsity Jacket', sku: 'SKU-004', price: 349, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=60&q=80' },
  { id: 'p12', title: 'Slim Bifold Leather Wallet', sku: 'SKU-005', price: 65, stock: 25, status: 'Active', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=60&q=80' },
];

const statusStyle: Record<string, string> = {
  'Active': 'bg-green-50 text-green-700',
  'Low Stock': 'bg-amber-50 text-amber-700',
  'Out of Stock': 'bg-red-50 text-red-600',
};

export default function VendorProductsPage() {
  const [search, setSearch] = useState('');
  const filtered = mockProducts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-1">Vendor Portal</p>
          <h1 className="font-display text-3xl font-bold text-black">My Inventory</h1>
        </div>
        <Link href="/vendor/products/new" className="bg-black text-white font-bold rounded-full px-5 h-10 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform">
          <Icon icon="mdi:plus" /> Add Product
        </Link>
      </div>

      {/* Summary Chips */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { label: 'All Products', count: mockProducts.length, active: true },
          { label: 'Active', count: mockProducts.filter(p => p.status === 'Active').length, active: false },
          { label: 'Low Stock', count: mockProducts.filter(p => p.status === 'Low Stock').length, active: false },
          { label: 'Out of Stock', count: mockProducts.filter(p => p.status === 'Out of Stock').length, active: false },
        ].map(chip => (
          <div key={chip.label} className={`flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-semibold transition-colors cursor-pointer ${chip.active ? 'bg-black text-white' : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200'}`}>
            {chip.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${chip.active ? 'bg-white/20' : 'bg-white'}`}>{chip.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icon icon="lucide:search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F5F5F5] rounded-full pl-10 pr-4 h-10 text-sm font-body outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 h-10 font-body text-sm font-semibold text-gray-600 hover:border-black transition-colors">
            <Icon icon="lucide:filter" className="text-sm" /> Filter
          </button>
          <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 h-10 font-body text-sm font-semibold text-gray-600 hover:border-black transition-colors">
            <Icon icon="mdi:export" className="text-sm" /> Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F9F9]">
                {['Product', 'SKU', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="font-body font-bold text-xs uppercase tracking-widest text-gray-400 text-left px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr key={product.id} className={`border-t border-gray-50 hover:bg-[#F9F9F9] transition-colors ${i % 2 === 0 ? '' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#F5F5F5] overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <span className="font-body font-semibold text-sm text-black line-clamp-1">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">{product.sku}</td>
                  <td className="px-5 py-4 font-display font-bold text-black">${product.price}</td>
                  <td className="px-5 py-4">
                    <span className={`font-body font-bold text-sm ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-amber-600' : 'text-black'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-body font-bold text-xs px-3 py-1 rounded-full ${statusStyle[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                        <Icon icon="lucide:edit-3" className="text-sm" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all">
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
            <Icon icon="mdi:package-variant-remove" className="text-5xl text-gray-200 mx-auto mb-3" />
            <p className="font-body font-semibold text-gray-400">No products match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
