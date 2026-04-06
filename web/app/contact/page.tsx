import { PageWrapper } from '@/components/shared/PageWrapper';
import { Icon } from '@iconify/react';
import { fetchStorefrontContent } from '@/lib/api';

export default async function ContactPage() {
  const content = await fetchStorefrontContent();
  const contact = content.contact;

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#84D347] mb-2 font-body">{contact.hero.eyebrow}</p>
          <h1 className="font-display text-5xl font-bold text-black tracking-tight mb-4">{contact.hero.title}</h1>
          <p className="font-body text-gray-500 text-lg max-w-lg mx-auto">{contact.hero.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#F5F5F5] rounded-3xl p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold text-black mb-8">{contact.form.title}</h2>
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body font-semibold text-sm text-black block mb-2">{contact.form.fields.firstName.label}</label>
                  <input type="text" placeholder={contact.form.fields.firstName.placeholder} className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-black font-body outline-none focus:border-black transition-colors text-sm" />
                </div>
                <div>
                  <label className="font-body font-semibold text-sm text-black block mb-2">{contact.form.fields.lastName.label}</label>
                  <input type="text" placeholder={contact.form.fields.lastName.placeholder} className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-black font-body outline-none focus:border-black transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">{contact.form.fields.email.label}</label>
                <input type="email" placeholder={contact.form.fields.email.placeholder} className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-black font-body outline-none focus:border-black transition-colors text-sm" />
              </div>
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">{contact.form.fields.subject.label}</label>
                <select className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-black font-body outline-none focus:border-black transition-colors text-sm">
                  {contact.form.subjectOptions.map((option: string) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body font-semibold text-sm text-black block mb-2">{contact.form.fields.message.label}</label>
                <textarea rows={5} placeholder={contact.form.fields.message.placeholder} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-black font-body outline-none focus:border-black transition-colors text-sm resize-none" />
              </div>
              <button type="submit" className="w-full bg-black text-white font-bold rounded-full h-14 font-body hover:scale-[1.02] transition-transform shadow-lg">
                {contact.form.submitLabel}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            {contact.infoCards.map((item: any) => (
              <div key={item.title} className="flex gap-5 p-6 bg-[#F5F5F5] rounded-3xl items-start">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon={item.icon} className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-black text-lg mb-1">{item.title}</h3>
                  {item.lines.map((l, i) => <p key={i} className="font-body text-gray-500 text-sm">{l}</p>)}
                </div>
              </div>
            ))}

            <div className="bg-black rounded-3xl p-8 text-black">
              <h3 className="font-display font-bold text-xl mb-2">{contact.liveChat.title}</h3>
              <p className="font-body text-sm mb-4">{contact.liveChat.description}</p>
              <button className="bg-black text-white font-bold rounded-full px-6 h-11 font-body text-sm hover:scale-105 transition-transform flex items-center gap-2">
                <Icon icon="mdi:chat-outline" className="text-lg" /> {contact.liveChat.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
