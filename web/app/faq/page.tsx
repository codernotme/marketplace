"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchStorefrontContent } from "@/lib/api";

const defaultFaqContent = {
  hero: {
    eyebrow: "Help Center",
    title: "Frequently Asked Questions",
    description: "Find quick answers about orders, payments, and shipping.",
    searchPlaceholder: "Search help topics",
  },
  categories: [
    {
      id: "orders",
      label: "Orders",
      icon: "mdi:package-variant-closed",
      faqs: [
        {
          q: "How do I track my order?",
          a: "Use the track order section in your account after placing an order.",
        },
      ],
    },
  ],
  support: {
    title: "Still need help?",
    description: "Our support team is ready to help you.",
    messageLabel: "Contact Support",
    emailLabel: "Email Us",
  },
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${open ? "shadow-sm" : ""}`}
    >
      <button
        className="w-full text-left flex items-center justify-between gap-4 p-5 hover:bg-[#F9F9F9] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-body font-semibold text-sm text-black">{q}</span>
        <div
          className={`w-7 h-7 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 transition-all ${open ? "bg-black" : ""}`}
        >
          <Icon
            className={`text-sm ${open ? "text-white" : "text-black"}`}
            icon={open ? "mdi:minus" : "mdi:plus"}
          />
        </div>
      </button>
      {open ? (
        <div className="px-5 pb-5">
          <p className="font-body text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function FAQPage() {
  const [faqContent, setFaqContent] = useState<any>(defaultFaqContent);
  const categories = faqContent.categories;
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id || "orders",
  );
  const current =
    categories.find((c: any) => c.id === activeCategory) ?? categories[0];

  useEffect(() => {
    const loadStorefront = async () => {
      const response = await fetchStorefrontContent();
      const responseFaq = (response as any)?.faq;

      if (responseFaq) {
        setFaqContent({ ...defaultFaqContent, ...responseFaq });
      }
    };

    loadStorefront();
  }, []);

  return (
    <div className="bg-white min-h-screen font-body">
      <div className="bg-black px-6 py-20 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-[#84D347] mb-3">
          {faqContent.hero.eyebrow}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          {faqContent.hero.title}
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">
          {faqContent.hero.description}
        </p>
        <div className="max-w-md mx-auto relative">
          <Icon
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
            icon="mdi:magnify"
          />
          <input
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 rounded-full pl-12 pr-5 h-12 outline-none focus:border-[#84D347] transition-colors font-body text-sm"
            placeholder={faqContent.hero.searchPlaceholder}
            type="text"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex gap-3 mb-10 flex-wrap">
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-body font-semibold text-sm transition-all ${activeCategory === cat.id ? "bg-black text-white shadow-sm" : "bg-[#F5F5F5] text-gray-600 hover:bg-gray-200"}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Icon className="text-base" icon={cat.icon} />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 mb-16">
          {current?.faqs?.map((faq: any, i: number) => (
            <FAQItem key={i} a={faq.a} q={faq.q} />
          ))}
        </div>

        <div className="bg-[#F5F5F5] rounded-3xl p-10 text-center">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Icon className="text-white text-2xl" icon="mdi:headset" />
          </div>
          <h2 className="font-display text-2xl font-bold text-black mb-2">
            {faqContent.support.title}
          </h2>
          <p className="font-body text-gray-500 text-sm max-w-md mx-auto mb-7">
            {faqContent.support.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              className="bg-black text-white font-bold rounded-full px-8 h-12 inline-flex items-center gap-2 hover:scale-105 transition-transform"
              href="/contact"
            >
              <Icon icon="mdi:message-outline" />{" "}
              {faqContent.support.messageLabel}
            </Link>
            <a
              className="border-2 border-gray-200 text-black font-bold rounded-full px-8 h-12 inline-flex items-center gap-2 hover:border-black transition-colors"
              href="mailto:support@themrktplace.com"
            >
              <Icon icon="mdi:email-outline" /> {faqContent.support.emailLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
