import Link from 'next/link';
import { Icon } from '@iconify/react';

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    content: `This Privacy Policy describes how themrktplace ("we", "us", or "our") collects, uses, and shares information about you when you use our services, including our website, mobile applications, and any other products or services we offer (collectively, the "Services"). By accessing or using our Services, you agree to this Privacy Policy.`,
  },
  {
    id: 'collection',
    title: '2. Information We Collect',
    content: `We collect information you provide directly, such as when you create an account, make a purchase, or contact support. This includes your name, email address, phone number, billing and shipping address, payment information, and any other information you choose to provide.\n\nWe also automatically collect certain information when you use our Services, including your IP address, browser type, device identifiers, pages visited, and referring URLs. We use cookies and similar tracking technologies to enhance your experience.`,
  },
  {
    id: 'usage',
    title: '3. How We Use Your Information',
    content: `We use the information we collect to process transactions, send order confirmations and updates, provide customer support, personalise your shopping experience, send promotional communications (with your consent), detect and prevent fraud, and improve our platform.\n\nWe may also use aggregated, de-identified data for analytics and to improve our Services.`,
  },
  {
    id: 'sharing',
    title: '4. Information Sharing',
    content: `We do not sell your personal information. We share your information with third-party vendors and service providers who assist us in operating our platform, such as payment processors, shipping partners, and marketing tools. These parties are contractually required to protect your information.\n\nWe may also disclose information if required by law, to protect our rights, or in connection with a merger or acquisition.`,
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking',
    content: `We use cookies and similar technologies to remember your preferences, authenticate your session, analyse traffic, and serve relevant advertisements. You can control cookies through your browser settings, though disabling them may affect parts of our Services.`,
  },
  {
    id: 'security',
    title: '6. Data Security',
    content: `We implement industry-standard security measures, including SSL encryption, to protect your personal information. However, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and to keep your account credentials confidential.`,
  },
  {
    id: 'rights',
    title: '7. Your Rights',
    content: `Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal information. You may also have the right to data portability and to opt out of marketing communications. To exercise these rights, contact us at privacy@themrktplace.com.`,
  },
  {
    id: 'children',
    title: '8. Children\'s Privacy',
    content: `Our Services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with personal information, we will delete it promptly.`,
  },
  {
    id: 'changes',
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our Services after changes constitutes acceptance of the new policy.`,
  },
  {
    id: 'contact',
    title: '10. Contact Us',
    content: `If you have questions or concerns about this Privacy Policy, please contact us at:\n\nthemrktplace\nprivacy@themrktplace.com\n123 Market Avenue, San Francisco, CA 94103\n\nBuilt with care by tacklestudioz.tech`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen font-body">
      {/* Hero */}
      <div className="bg-black px-6 py-20 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-[#84D347] mb-3">Legal</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">Last updated: March 21, 2026</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Sticky TOC */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24">
            <p className="font-body font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Contents</p>
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
            <div key={s.id} id={s.id}>
              <h2 className="font-display text-xl font-bold text-black mb-3">{s.title}</h2>
              {s.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{para}</p>
              ))}
            </div>
          ))}

          {/* CTA */}
          <div className="bg-[#F5F5F5] rounded-3xl p-8 text-center">
            <p className="font-display font-bold text-xl text-black mb-2">Have questions?</p>
            <p className="text-gray-500 text-sm mb-5">Our team is happy to help with any privacy concerns.</p>
            <Link href="/contact" className="bg-black text-white font-bold rounded-full px-8 h-11 inline-flex items-center gap-2 hover:scale-105 transition-transform">
              <Icon icon="mdi:email-outline" /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
