'use client';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';

const categories = [
  {
    id: 'orders',
    label: 'Orders & Shipping',
    icon: 'mdi:truck-delivery-outline',
    faqs: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3–7 business days. Express shipping (1–2 days) is available at checkout for an additional fee. International orders may take 7–14 business days depending on the destination country and customs.' },
      { q: 'Can I track my order?', a: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can track your order in real-time from your Orders dashboard or directly on the carrier\'s website.' },
      { q: 'What happens if my order is lost in transit?', a: 'If your order doesn\'t arrive within the estimated delivery window, please contact our support team. We\'ll investigate with the carrier and either re-ship your order or issue a full refund.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to over 40 countries worldwide. International shipping rates and estimated delivery times are shown at checkout. Note that customs duties and import taxes are the responsibility of the recipient.' },
      { q: 'Can I change my delivery address after placing an order?', a: 'Address changes are possible within 1 hour of placing your order. After that, the order may have already been dispatched and we cannot guarantee a change. Contact support immediately if you need to update your address.' },
    ],
  },
  {
    id: 'returns',
    label: 'Returns & Refunds',
    icon: 'mdi:cash-refund',
    faqs: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery for unused, unworn items in original packaging. Simply visit your Orders page and click "Request Return" to get started. See our full Refund Policy for details.' },
      { q: 'How long does a refund take?', a: 'Once we receive and inspect your return (3–5 business days), your refund is processed and typically appears on your account within 5–10 business days, depending on your bank.' },
      { q: 'Can I exchange an item for a different size?', a: 'We don\'t offer direct exchanges at this time. Please return the item for a refund and place a new order for the correct size. This ensures the fastest delivery of your preferred item.' },
      { q: 'What if my item arrives damaged?', a: 'If your item is damaged or defective, contact us within 48 hours of delivery with photos. We\'ll send a free replacement or issue a full refund — no return required for damaged goods.' },
    ],
  },
  {
    id: 'account',
    label: 'Account & Payments',
    icon: 'mdi:account-circle-outline',
    faqs: [
      { q: 'How do I create an account?', a: 'Click "Sign In" in the top navigation and select "Create account". You can sign up with your email address or use Google for one-click registration. Your account lets you track orders, save wishlist items, and check out faster.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay. All transactions are secured with 256-bit SSL encryption.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. We never store your full card details. All payments are processed through PCI-DSS compliant payment gateways. Your financial information is encrypted and never accessible to us.' },
      { q: 'Can I save multiple addresses?', a: 'Yes! You can save up to 5 shipping addresses in your account profile. Set a default address for faster checkout, or choose a different address at the time of purchase.' },
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a reset link within a few minutes. If you don\'t see it, check your spam folder.' },
    ],
  },
  {
    id: 'products',
    label: 'Products & Authenticity',
    icon: 'mdi:shield-check-outline',
    faqs: [
      { q: 'Are all products authentic?', a: 'Yes, 100%. We partner directly with brands and authorised distributors. Every product goes through a verification process before being listed on our platform. We have a zero-tolerance policy for counterfeit goods.' },
      { q: 'How do I know which size to order?', a: 'Each product page includes a detailed size guide specific to that item\'s brand and category. When in doubt, our support team can help you choose the right fit before you buy.' },
      { q: 'Can I become a vendor on themrktplace?', a: 'Yes! We welcome quality brands and sellers. Visit our Vendor Portal and apply to list your products. Our team reviews applications and typically responds within 3–5 business days.' },
      { q: 'How do I report a counterfeit product?', a: 'If you suspect a product is not authentic, please contact us immediately at authenticity@themrktplace.com with your order number and photos. We take all such reports seriously and investigate thoroughly.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${open ? 'shadow-sm' : ''}`}>
      <button
        className="w-full text-left flex items-center justify-between gap-4 p-5 hover:bg-[#F9F9F9] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-body font-semibold text-sm text-black">{q}</span>
        <div className={`w-7 h-7 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 transition-all ${open ? 'bg-black' : ''}`}>
          <Icon icon={open ? 'mdi:minus' : 'mdi:plus'} className={`text-sm ${open ? 'text-white' : 'text-black'}`} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="font-body text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('orders');
  const current = categories.find(c => c.id === activeCategory)!;

  return (
    <div className="bg-white min-h-screen font-body">
      {/* Hero */}
      <div className="bg-black px-6 py-20 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-[#84D347] mb-3">Help Centre</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">Can't find your answer? Reach out to our support team — we're here to help.</p>
        <div className="max-w-md mx-auto relative">
          <Icon icon="mdi:magnify" className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 rounded-full pl-12 pr-5 h-12 outline-none focus:border-[#84D347] transition-colors font-body text-sm"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Category tabs */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-body font-semibold text-sm transition-all ${activeCategory === cat.id ? 'bg-black text-white shadow-sm' : 'bg-[#F5F5F5] text-gray-600 hover:bg-gray-200'}`}
            >
              <Icon icon={cat.icon} className="text-base" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="flex flex-col gap-3 mb-16">
          {current.faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* Still need help? */}
        <div className="bg-[#F5F5F5] rounded-3xl p-10 text-center">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Icon icon="mdi:headset" className="text-white text-2xl" />
          </div>
          <h2 className="font-display text-2xl font-bold text-black mb-2">Still have questions?</h2>
          <p className="font-body text-gray-500 text-sm max-w-md mx-auto mb-7">Our team typically responds within 2 business hours. We're available Monday–Friday, 9am–6pm PST.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-black text-white font-bold rounded-full px-8 h-12 inline-flex items-center gap-2 hover:scale-105 transition-transform">
              <Icon icon="mdi:message-outline" /> Send a Message
            </Link>
            <a href="mailto:support@themrktplace.com" className="border-2 border-gray-200 text-black font-bold rounded-full px-8 h-12 inline-flex items-center gap-2 hover:border-black transition-colors">
              <Icon icon="mdi:email-outline" /> support@themrktplace.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
