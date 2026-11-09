import { useLanguage } from '../i18n/LanguageContext.jsx'
import { PageHero } from '../components/ui.jsx'

const docs = {
  privacy: {
    image: '/privacy-hero.jpg',
    badge: 'Legal',
    title: 'Privacy Policy',
    updated: 'Last updated: January 2026',
    intro:
      'Ras Al Khaimah International Airport ("RAK", "we", "us") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and the choices you have.',
    sections: [
      { h: 'Information We Collect', p: 'We may collect information you provide directly - such as your name, contact details and travel preferences - as well as information collected automatically, including device data, IP address and pages visited on our website.' },
      { h: 'How We Use Your Information', p: 'We use your information to provide and improve our services, respond to enquiries, personalise your experience, send service updates, and comply with legal and regulatory obligations.' },
      { h: 'Cookies & Analytics', p: 'Where enabled, optional analytics cookies are used only after you accept them. You can reject analytics cookies in the notice shown on the website, or change your browser storage settings.' },
      { h: 'Sharing of Information', p: 'We do not sell your personal data. We may share information with trusted service providers, airline and airport partners, and authorities where required by law.' },
      { h: 'Data Security', p: 'We apply appropriate technical and organisational measures to protect your information against unauthorised access, alteration or disclosure.' },
      { h: 'Your Rights', p: 'You may request access to, correction of, or deletion of your personal information, subject to applicable law. To exercise these rights, please contact us.' },
      { h: 'Contact Us', p: 'For any privacy questions or requests, contact the RAK data protection team via the details provided on our website.' },
    ],
  },
  bylaws: {
    image: '/by-laws-hero.jpg',
    badge: 'Legal',
    title: 'By-laws & Conditions of Use',
    updated: 'Last updated: January 2026',
    intro:
      'These conditions govern your use of the Ras Al Khaimah International Airport website and facilities. By accessing our website or premises, you agree to comply with these terms.',
    sections: [
      { h: 'Acceptance of Terms', p: 'Your use of this website and the airport facilities constitutes acceptance of these by-laws and any additional rules displayed on-site or published by the airport authority.' },
      { h: 'Use of the Website', p: 'Content on this website is provided for general information only. You agree not to misuse the website, attempt unauthorised access, or use it for any unlawful purpose.' },
      { h: 'Airport Conduct', p: 'Visitors must follow all safety, security and signage instructions while on airport premises. Unattended baggage may be removed and treated as suspicious.' },
      { h: 'Intellectual Property', p: 'All trademarks, logos and content on this website are the property of RAK or its licensors and may not be reproduced without prior written consent.' },
      { h: 'Limitation of Liability', p: 'Flight times and information are indicative and subject to change. RAK is not liable for losses arising from reliance on website information or from third-party services.' },
      { h: 'Governing Law', p: 'These terms are governed by the laws of the United Arab Emirates and the Emirate of Ras Al Khaimah, and any disputes are subject to its courts.' },
      { h: 'Changes to These Terms', p: 'We may update these by-laws from time to time. Continued use of the website or facilities indicates acceptance of the revised terms.' },
    ],
  },
}

export default function Legal({ doc }) {
  const { t: tr, language } = useLanguage()
  const d = docs[doc]
  return (
    <article className="bg-mist">
      <PageHero image={d.image} badge={d.badge} title={tr(d.title)} subtitle={d.updated} />

      <div className="container-x max-w-3xl py-16">
        <p className="text-[15px] leading-relaxed text-ink/65">{tr(d.intro)}</p>
        <div className="mt-10 space-y-9">
          {d.sections.map((s, i) => (
            <section key={s.h} style={{ animationDelay: `${i * 0.04}s` }} className="animate-fade-up">
              <h2 className="flex items-baseline gap-3 font-display text-lg font-semibold text-ink">
                <span className="text-[14px] font-bold text-brand-400">{String(i + 1).padStart(2, '0')}</span>
                {tr(s.h)}
              </h2>
              <p className="mt-2 pl-9 text-[14px] leading-relaxed text-ink/60">{tr(s.p)}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}
