import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Introduction',
      content: 'Welcome to themrktplace. These Terms and Conditions govern your use of our website, mobile application, and related services (the "Platform"). By accessing or using the Platform, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our services.',
    },
    {
      title: '2. Account Registration',
      content: 'To access certain features of the Platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 18 years of age to create an account and make purchases. You agree to provide accurate, current, and complete information during registration.',
    },
    {
      title: '3. Purchases & Payment',
      content: 'All purchases made through themrktplace are subject to product availability. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities, inaccuracies in product or pricing information, or problems identified by our fraud prevention department. Prices are listed in USD and are subject to change without notice.',
    },
    {
      title: '4. Shipping & Delivery',
      content: 'We offer standard and express shipping options. Estimated delivery times are provided at checkout and are not guaranteed. We are not responsible for delays caused by customs, weather, or other factors beyond our control. Risk of loss transfers to you upon our delivery to the shipping carrier.',
    },
    {
      title: '5. Returns & Refunds',
      content: 'We offer a 30-day return window for most items. Items must be in their original condition, with tags attached and in original packaging. To initiate a return, contact our support team. Refunds are processed within 5–10 business days after we receive your return. Certain items such as intimate apparel and final sale items are non-returnable.',
    },
    {
      title: '6. Intellectual Property',
      content: 'All content on the Platform — including text, graphics, logos, icons, images, audio clips, and software — is the property of themrktplace or its content suppliers and protected by international copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our explicit written consent.',
    },
    {
      title: '7. Privacy Policy',
      content: 'Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your personal information.',
    },
    {
      title: '8. Limitation of Liability',
      content: 'themrktplace shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the Platform or any content on the Platform. Our total liability to you for any claim arising out of or relating to these terms or the Platform shall not exceed the amount you paid to us in the six months prior to the claim.',
    },
    {
      title: '9. Governing Law',
      content: 'These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the state or federal courts located in San Francisco, California.',
    },
    {
      title: '10. Changes to Terms',
      content: 'We may modify these Terms at any time. We will notify you of significant changes via email or prominent notice on the Platform. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-black py-16">
        <PageWrapper>
          <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-3">Legal</p>
          <h1 className="font-display text-5xl font-bold text-white tracking-tight mb-3">Terms of Service</h1>
          <p className="font-body text-gray-400">Last updated: March 21, 2026</p>
        </PageWrapper>
      </section>

      <PageWrapper>
        <div className="py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-[#F5F5F5] rounded-3xl p-6">
              <p className="font-body font-bold text-sm uppercase tracking-widest text-[#84D347] mb-4">Contents</p>
              <nav className="flex flex-col gap-2">
                {sections.map((s, i) => (
                  <a key={i} href={`#section-${i}`} className="font-body text-sm text-gray-500 hover:text-black transition-colors py-1 border-l-2 border-transparent hover:border-[#84D347] pl-3">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#F5F5F5] rounded-3xl p-8 mb-8">
              <div className="flex items-start gap-4">
                <Icon icon="mdi:information-outline" className="text-2xl text-[#84D347] flex-shrink-0 mt-0.5" />
                <p className="font-body text-gray-600 text-sm leading-relaxed">
                  Please read these Terms carefully before using themrktplace. They affect your legal rights and obligations.
                  If you have any questions, <Link href="/contact" className="text-black font-semibold hover:text-[#84D347]">contact our support team</Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              {sections.map((section, i) => (
                <div key={i} id={`section-${i}`} className="scroll-mt-24">
                  <h2 className="font-display text-xl font-bold text-black mb-3">{section.title}</h2>
                  <p className="font-body text-gray-600 leading-relaxed text-[15px]">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Footer contact */}
            <div className="mt-12 bg-black rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div>
                <h3 className="font-display font-bold text-white text-xl mb-1">Questions about these terms?</h3>
                <p className="font-body text-gray-400 text-sm">Our legal team is happy to help.</p>
              </div>
              <Link href="/contact" className="bg-[#84D347] text-black font-bold rounded-full px-6 h-11 flex items-center gap-2 font-body text-sm hover:scale-105 transition-transform flex-shrink-0">
                Contact Us <Icon icon="lucide:arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
