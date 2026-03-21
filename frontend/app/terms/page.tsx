import { PageWrapper } from '@/components/shared/PageWrapper';

export default function TermsPage() {
  return (
    <div className="bg-white text-black min-h-screen">
      <PageWrapper>
        <div className="max-w-3xl mx-auto py-16 px-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-8">Terms & Conditions</h1>
          <p className="font-body text-gray-500 mb-12 uppercase tracking-widest text-sm font-semibold">Last Updated: March 2026</p>

          <div className="space-y-8 font-body text-base leading-relaxed text-gray-700">
            <section>
              <h2 className="font-display text-2xl font-bold text-black mb-4">1. Introduction</h2>
              <p>Welcome to themrktplace Marketplace. These Terms and Conditions govern your use of our website, mobile application, and related services. By accessing or using our platform, you agree to be bound by these terms.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-black mb-4">2. Account Registration</h2>
              <p>To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-black mb-4">3. Purchases and Payment</h2>
              <p>All purchases made through the themrktplace Marketplace are subject to product availability. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies in product or pricing information, or problems identified by our fraud prevention department.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-black mb-4">4. Intellectual Property</h2>
              <p>All content included on the site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, and data compilations, is the property of themrktplace or its content suppliers and protected by international copyright laws.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-black mb-4">5. Limitation of Liability</h2>
              <p>themrktplace shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the services or any content on the services.</p>
            </section>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
