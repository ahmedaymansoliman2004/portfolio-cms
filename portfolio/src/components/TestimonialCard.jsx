import { motion } from 'framer-motion';
import { ExternalLink, MessageSquareQuote } from 'lucide-react';
import { useLang } from '../context/LangContext';

const CARD_COLORS = ['#00E5FF', '#22C55E', '#8B5CF6', '#F59E0B', '#EC4899'];

const getLocalizedValue = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') {
    return value?.[lang] || value?.en || value?.ar || '';
  }
  return value;
};

const StarRating = ({ rating }) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));

  return (
    <div className="flex gap-0.5" aria-label={`${safeRating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-lg leading-none ${i < safeRating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-700'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const PlatformBadge = ({ platform }) => {
  const colors = {
    Khamsat: '#10b981',
    Mostaql: '#3b82f6',
  };
  const color = colors[platform] || '#6b7280';

  return (
    <span
      className="text-xs font-bold px-3 py-1 rounded-full"
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
      }}
    >
      {platform || 'Review'}
    </span>
  );
};

export default function TestimonialCard({ testimonial, index }) {
  const { lang, t } = useLang();

  const color = testimonial.color || CARD_COLORS[index % CARD_COLORS.length];
  const name = getLocalizedValue(testimonial.name, lang);
  const service = getLocalizedValue(testimonial.service, lang);
  const comment =
    getLocalizedValue(testimonial.comment, lang) ||
    getLocalizedValue(testimonial.quote, lang) ||
    getLocalizedValue(testimonial.review, lang);

  const initialsSource = name || testimonial.platform || 'R';
  const initials = testimonial.initials || initialsSource.trim().slice(0, 1).toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      className="relative min-h-[260px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.045]"
      style={{ boxShadow: `inset 0 1px 0 ${color}18` }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute -top-28 -end-24 h-56 w-56 rounded-full blur-3xl opacity-10"
        style={{ background: color }}
      />

      <div className="relative z-10 flex h-full flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <PlatformBadge platform={testimonial.platform} />
          <StarRating rating={testimonial.rating} />
        </div>

        {service && (
          <p className="flex items-center gap-2 font-mono text-xs text-gray-500 dark:text-gray-500">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: color }} />
            <span>{service}</span>
          </p>
        )}

        <div className="relative flex-1">
          <MessageSquareQuote
            size={42}
            className="w-5 h-5 opacity-30"
            style={{ color }}
          />
          <p
            className="ps-6 text-sm leading-7 text-gray-700 dark:text-gray-300"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {comment || (lang === 'ar' ? 'لا يوجد نص للتقييم حالياً.' : 'No review text provided yet.')}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-white/10">
          <div className="flex min-w-0 items-center gap-3">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={name}
                className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
              >
                {initials}
              </div>
            )}

            <p
              className="truncate font-display text-sm font-semibold text-gray-900 dark:text-white"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              {name || 'Client'}
            </p>
          </div>

          {testimonial.link && (
            <a
              href={testimonial.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                color,
                borderColor: `${color}55`,
                background: `${color}10`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${color}22`;
                e.currentTarget.style.boxShadow = `0 8px 24px ${color}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${color}10`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ExternalLink size={12} />
              {t.testimonials.viewRating}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
