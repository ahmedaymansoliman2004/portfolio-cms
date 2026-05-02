import { motion } from 'framer-motion';
import { Linkedin, GraduationCap, ExternalLink } from 'lucide-react';
import { testimonials as fallbackTestimonials, recommendation as fallbackRecommendation } from '../data/testimonials';
import { useCms, cmsTestimonials, siteText } from '../context/CmsContext';
import TestimonialCard from '../components/TestimonialCard';
import { useLang } from '../context/LangContext';

function RecommendationSection({ recommendation }) {
  const { lang, t } = useLang();
  const rec = recommendation || fallbackRecommendation;

  const prof = rec.professor
    ? rec.professor
    : {
        name: rec.name?.en || rec.name || '',
        nameAr: rec.name?.ar || rec.nameAr || rec.name || '',
        title: rec.title || { ar: '', en: '' },
        institution: rec.institution || { ar: '', en: '' },
        linkedin: rec.linkedin || '',
        followers: rec.followers || '',
        avatar: rec.avatar || '',
      };

  const quoteSource = rec.quote || {};
  const quoteText = typeof quoteSource === 'string'
    ? quoteSource
    : (quoteSource[lang] || quoteSource.en || quoteSource.ar || '');
  const paragraphs = String(quoteText).split('\n\n').filter(Boolean);

  // Key phrases to highlight
  const highlights = {
    ar: ['أكثر الطلاب التزامًا وموهبةً', 'تفانيه في التعلم', 'فهمًا عميقًا', 'أوصي بأحمد بشدة'],
    en: ['most committed and talented', 'dedication to learning', 'deep understanding', 'highly recommend Ahmed'],
  };

  const highlightText = (text) => {
    const phrases = highlights[lang];
    let result = text;
    // We'll render with spans by splitting
    let parts = [text];
    phrases.forEach(phrase => {
      parts = parts.flatMap(part => {
        if (typeof part !== 'string') return [part];
        const idx = part.indexOf(phrase);
        if (idx === -1) return [part];
        return [
          part.slice(0, idx),
          <mark key={phrase} className="bg-accent/15 text-accent dark:text-accent px-0.5 rounded not-italic font-semibold" style={{ background: 'rgba(0,229,255,0.12)' }}>{phrase}</mark>,
          part.slice(idx + phrase.length),
        ];
      });
    });
    return parts;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16"
    >
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6 justify-center">
        <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-accent/30" />
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/8 border border-accent/20">
          <GraduationCap size={13} className="text-accent" />
          <span className="text-xs font-mono text-accent tracking-wider">{t.testimonials.recommendationLabel}</span>
        </div>
        <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-accent/30" />
      </div>

      {/* Card */}
      <div className="relative card-glass rounded-2xl overflow-hidden border-accent/20">
        {/* Top accent bar */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="p-8 sm:p-10">
          {/* Professor info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-white/10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {prof.avatar ? (
                <img
                  src={prof.avatar}
                  alt={lang === 'ar' ? prof.nameAr : prof.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-accent/20"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center">
                  <span className="font-display font-bold text-xl text-white">
                    {(lang === 'ar' ? prof.nameAr : prof.name)
                      ?.split(' ')
                      .map(word => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'AM'}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
            </div>

            <div className={`flex-1 text-start`}>
              <a
                href={prof.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 group"
              >
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                  {lang === 'ar' ? prof.nameAr : prof.name}
                </h3>
                <ExternalLink size={13} className="text-gray-400 group-hover:text-accent transition-colors" />
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed max-w-lg">
                {prof.title[lang]}
              </p>
              <p className="text-xs font-mono text-accent/70 mt-1">{prof.institution[lang]}</p>
            </div>

            {/* Followers badge */}
            <div className={`flex-shrink-0 text-center sm:ms-auto`}>
              <div className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="font-display font-bold text-lg text-blue-500">{prof.followers}</p>
                <p className="text-xs font-mono text-blue-400/70">LinkedIn</p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="relative">
            {/* Decorative quote mark */}
            <div
              className="absolute text-6xl font-serif leading-none text-accent inset-inline-start-0 top-0 select-none"
              style={{ opacity: 0.07 }}
            >
              “
            </div>

            <div className="space-y-4 ps-8 sm:ps-12">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={`text-gray-600 dark:text-gray-300 leading-relaxed ${
                    i === paragraphs.length - 1
                      ? 'font-semibold text-gray-800 dark:text-white text-base'
                      : 'text-sm'
                  }`}
                >
                  {highlightText(para)}
                </p>
              ))}
            </div>

            {/* Closing quote */}
            <div className="mt-6 flex justify-end">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400 dark:text-gray-600">
                <span>—</span>
                <span>{lang === 'ar' ? prof.nameAr : prof.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const { t, lang } = useLang();
  const { data: cmsData } = useCms();
  const { testimonials, recommendation } = cmsTestimonials(cmsData, fallbackTestimonials, fallbackRecommendation);
  const testimonialsTitle = siteText(cmsData, 'reviews', 'title', lang, t.testimonials.title);
  const testimonialsSubtitle = siteText(cmsData, 'reviews', 'subtitle', lang, t.testimonials.subtitle);

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">{t.testimonials.label}</p>
          <h2 className="section-heading text-gray-900 dark:text-white mb-4">{testimonialsTitle}</h2>
          <p className="text-gray-500 dark:text-gray-500 max-w-lg mx-auto">{testimonialsSubtitle}</p>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>

        {/* Academic Recommendation */}
        <RecommendationSection recommendation={recommendation} />
      </div>
    </section>
  );
}
