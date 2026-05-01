import { useState } from 'react';
import { motion } from 'framer-motion';
import { certificates as fallbackCertificates } from '../data/certificates';
import { useCms, cmsCertificates, siteText } from '../context/CmsContext';
import CertificateCard from '../components/CertificateCard';
import CertificateLightbox from '../components/CertificateLightbox';
import { useLang } from '../context/LangContext';

const FILTERS = {
  en: ['All', 'Internship', 'DEPI', 'Workshop', 'Program', 'CS Basics'],
  ar: ['الكل', 'تدريب', 'DEPI', 'ورشة', 'برنامج', 'أساسيات'],
};
const BADGE_KEYS = ['All', 'Internship', 'DEPI', 'Workshop', 'Program', 'CS Basics'];

export default function Certificates() {
  const { t, lang } = useLang();
  const { data: cmsData } = useCms();
  const certificates = cmsCertificates(cmsData, fallbackCertificates);
  const [active, setActive]     = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const isAr = lang === 'ar';
  const certificatesTitle = siteText(cmsData, 'certificates', 'title', lang, t.certificates.title);
  const certificatesSubtitle = siteText(cmsData, 'certificates', 'subtitle', lang, isAr
    ? 'شهادات مهنية وورش عمل مكتملة في الذكاء الاصطناعي والبيانات والتكنولوجيا.'
    : 'Professional certifications, internships & workshops in AI, data, and technology.');

  const normalizedBadge = (value) => String(value || '').trim().toLowerCase();

  const filtered = active === 'All'
    ? certificates
    : certificates.filter(c => normalizedBadge(c.badge || c.type?.en) === normalizedBadge(active));

  const filterLabels = FILTERS[lang];

  return (
    <section id="certificates" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="font-mono text-xs text-accent ltr:tracking-widest ltr:uppercase mb-3">
            {t.certificates.label}
          </p>
          <h2 className="section-heading text-gray-900 dark:text-white mb-4">
            {certificatesTitle}
          </h2>
          <p className="text-gray-500 dark:text-gray-500 max-w-lg mx-auto text-sm">
            {certificatesSubtitle}
          </p>
        </motion.div>

        {/* ── Filter Tabs ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {BADGE_KEYS.map((key, i) => {
            const label   = filterLabels[i];
            const isActive = active === key;
            const cert     = certificates.find(c => normalizedBadge(c.badge || c.type?.en) === normalizedBadge(key));
            const color    = cert?.color ?? 'var(--color-accent)';
            const count    = key === 'All'
              ? certificates.length
              : certificates.filter(c => normalizedBadge(c.badge || c.type?.en) === normalizedBadge(key)).length;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="text-xs font-mono px-4 py-1.5 rounded-full border transition-all duration-200"
                style={isActive ? {
                  background: color + '22',
                  borderColor: color + '66',
                  color: color,
                } : {
                  background: 'transparent',
                  borderColor: 'rgba(156,163,175,0.3)',
                  color: 'rgba(156,163,175,1)',
                }}
              >
                {label}
                {key !== 'All' && (
                  <span className="ms-1.5 opacity-60">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Grid ──────────────────────────────────────── */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((cert, i) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              index={i}
              onOpen={setLightbox}
            />
          ))}
        </motion.div>

        {/* ── Empty state ───────────────────────────────── */}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">
            {isAr ? 'لا توجد شهادات في هذه الفئة.' : 'No certificates in this category.'}
          </p>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────────────── */}
      {lightbox && (
        <CertificateLightbox
          cert={lightbox}
          certs={filtered}
          onClose={() => setLightbox(null)}
          onNavigate={setLightbox}
        />
      )}
    </section>
  );
}
