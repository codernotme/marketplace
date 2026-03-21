import Link from 'next/link';
import { Icon } from '@iconify/react';

const sections = [
  {
    id: 'eligibility',
    title: '1. Eligibility',
    content: 'We accept return requests within 30 days of the delivery date. Items must be unused, unworn, unwashed, and in their original packaging with all tags attached. Sale items, digital products, and personalised/custom items are not eligible for returns unless they arrive damaged or defective.',
  },
  {
    id: 'process',
    title: '2. How to Initiate a Return',
    content: 'To start a return, visit your Orders page and select "Request Return" next to the relevant order. You will receive a prepaid return shipping label via email within 24 hours. Pack your item securely, attach the label, and drop it off at any authorised carrier location.\n\nPlease do not send items back without first initiating a return request — unrequested returns cannot be processed.',
  },
  {
    id: 'refund-timeline',
    title: '3. Refund Timeline',
    content: 'Once we receive and inspect your return (typically within 3–5 business days of receipt), we will process your refund. Refunds are credited to the original payment method within 5–10 business days, depending on your bank or card issuer.\n\nYou will receive an email confirmation once your refund has been processed.',
  },
  {
    id: 'refund-methods',
    title: '4. Refund Methods',
    content: 'Refunds are issued to the original payment method only. We do not offer cash refunds or cross-method refunds. If you paid via credit/debit card, the refund will appear on your statement within 5–10 business days. PayPal refunds typically appear within 3–5 business days.',
  },
  {
    id: 'exchanges',
    title: '5. Exchanges',
    content: 'We currently do not offer direct exchanges. If you need a different size or colour, please return the original item for a refund and place a new order. This ensures the fastest fulfilment of your preferred item.',
  },
  {
    id: 'damaged',
    title: '6. Damaged or Defective Items',
    content: 'If your order arrives damaged or defective, please contact us within 48 hours of delivery with a photo of the damaged item and packaging. We will arrange a free replacement or full refund at no additional cost to you.',
  },
  {
    id: 'non-returnable',
    title: '7. Non-Returnable Items',
    content: 'The following items are not eligible for return or refund: final sale / clearance items, digital downloads, gift cards, intimate apparel and swimwear (for hygiene reasons), personalised or custom-engraved products.',
  },
  {
    id: 'shipping-costs',
    title: '8. Shipping Costs',
    content: 'Return shipping is free for defective, damaged, or incorrectly delivered items. For all other returns, the prepaid label cost ($6.99) will be deducted from your refund unless your order qualifies for free returns (orders over $150).',
  },
];

export default function RefundPage() {
  return (
    <div className="bg-white min-h-screen font-body">
      {/* Hero */}
      <div className="bg-black px-6 py-20 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-[#84D347] mb-3">Policies</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Refund Policy</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">30-day hassle-free returns. Your satisfaction is our priority.</p>
      </div>

      {/* Quick stats bar */}
      <div className="bg-[#F5F5F5] border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: 'mdi:calendar-check-outline', stat: '30 Days', sub: 'Return window' },
            { icon: 'mdi:truck-check-outline', stat: 'Free', sub: 'Return shipping on defects' },
            { icon: 'mdi:cash-refund', stat: '5-10 Days', sub: 'Refund processing' },
          ].map(item => (
            <div key={item.stat}>
              <Icon icon={item.icon} className="text-2xl text-[#84D347] mx-auto mb-1" />
              <p className="font-display font-bold text-lg text-black">{item.stat}</p>
              <p className="font-body text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Sticky TOC */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24">
            <p className="font-body font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Sections</p>
            <nav className="flex flex-col gap-2">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="font-body text-sm text-gray-500 hover:text-black transition-colors py-1 border-l-2 border-transparent hover:border-[#84D347] pl-3">
                  {s.title.split('. ')[1]}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="md:col-span-3 flex flex-col gap-10">
          {sections.map(s => (
            <div key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-display text-xl font-bold text-black mb-3">{s.title}</h2>
              {s.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{para}</p>
              ))}
            </div>
          ))}

          {/* CTA */}
          <div className="bg-black rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="font-display font-bold text-xl text-white mb-1">Need Help with a Return?</p>
              <p className="text-gray-400 text-sm">Our support team typically responds within 2 hours on business days.</p>
            </div>
            <Link href="/contact" className="bg-[#84D347] text-black font-bold rounded-full px-7 h-11 inline-flex items-center gap-2 hover:scale-105 transition-transform flex-shrink-0">
              <Icon icon="mdi:message-outline" /> Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
