'use client';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function AddProductPage() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/vendor/products" className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Icon icon="lucide:arrow-left" className="text-black" />
        </Link>
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#84D347] mb-0.5">Vendor Portal</p>
          <h1 className="font-display text-3xl font-bold text-black">Add New Product</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm">
            <h3 className="font-display font-bold text-lg text-black mb-5">Basic Information</h3>
            <div className="flex flex-col gap-5">
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">Product Title *</label>
                <input type="text" placeholder="e.g. Minimalist Leather Watch" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all" />
              </div>
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">Description *</label>
                <textarea rows={5} placeholder="Describe your product in detail. Include materials, dimensions, and any unique features." className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 py-3 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body font-semibold text-sm text-black block mb-2">Brand</label>
                  <input type="text" placeholder="e.g. Timecraft" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="font-body font-semibold text-sm text-black block mb-2">Category *</label>
                  <select className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all appearance-none cursor-pointer">
                    <option value="">Select category</option>
                    <option>Accessories</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Footwear</option>
                    <option>Home & Living</option>
                    <option>Fitness</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm">
            <h3 className="font-display font-bold text-lg text-black mb-5">Pricing & Stock</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input type="number" placeholder="0.00" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl pl-8 pr-4 h-12 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">Compare Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input type="number" placeholder="0.00" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl pl-8 pr-4 h-12 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">Stock Qty *</label>
                <input type="number" placeholder="0" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5 p-4 bg-[#F9F9F9] rounded-2xl">
              <input type="checkbox" id="isFeatured" className="w-4 h-4 accent-black" />
              <label htmlFor="isFeatured" className="font-body text-sm text-gray-600 cursor-pointer">Mark as <strong>Featured</strong> product (shows in homepage spotlight)</label>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg text-black">Variants / Sizes</h3>
              <button className="text-sm font-bold text-[#84D347] flex items-center gap-1 hover:opacity-80">
                <Icon icon="mdi:plus" /> Add Variant
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <div key={size} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center font-bold text-sm">{size}</div>
                  <input type="number" placeholder="Stock qty" className="flex-1 bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 h-12 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all" />
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Icon icon="lucide:x" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Image upload + settings */}
        <div className="flex flex-col gap-6">
          {/* Image Upload */}
          <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm">
            <h3 className="font-display font-bold text-lg text-black mb-5">Product Images</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-black transition-colors cursor-pointer group">
              <Icon icon="mdi:cloud-upload-outline" className="text-4xl text-gray-300 group-hover:text-black transition-colors mx-auto mb-3" />
              <p className="font-body font-semibold text-sm text-black mb-1">Drop images here</p>
              <p className="font-body text-xs text-gray-400">PNG, JPG up to 10MB each</p>
              <button className="mt-4 bg-[#F5F5F5] text-black font-bold rounded-full px-5 h-9 text-sm font-body hover:bg-gray-200 transition-colors">
                Browse Files
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'].map((img, i) => (
                <div key={i} className="relative w-full aspect-square bg-[#F5F5F5] rounded-xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                  <button className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="lucide:x" className="text-white text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO & Slug */}
          <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm">
            <h3 className="font-display font-bold text-lg text-black mb-5">SEO & URL</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">URL Slug</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">/products/</span>
                  <input type="text" placeholder="my-product-name" className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl pl-24 pr-4 h-12 text-black font-mono text-xs outline-none focus:border-black focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">Meta Description</label>
                <textarea rows={3} placeholder="Brief description for search engines..." className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-xl px-4 py-3 text-black font-body text-sm outline-none focus:border-black focus:bg-white transition-all resize-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button className="w-full h-14 bg-black text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform shadow-lg font-body text-base">
            Publish Product
          </button>
          <button className="w-full h-12 border-2 border-gray-200 text-black font-bold rounded-2xl hover:border-black transition-colors font-body text-sm">
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}
