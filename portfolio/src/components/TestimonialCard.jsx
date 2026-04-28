import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useLang } from '../context/LangContext';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-base ${i < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-700'}`}>★</span>
    ))}
  </div>
);

const PlatformBadge = ({ platform }) => {
  const colors = {
    Khamsat: { bg: '#10b981', text: 'white' },
    Mostaql: { bg: '#3b82f6', text: 'white' },
  };
  const c = colors[platform] || { bg: '#6b7280', text: 'white' };
  return (
    <span
      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
      style={{ background: c.bg + '22', color: c.bg, border: `1px solid ${c.bg}44` }}
    >
      {platform}
    </span>
  );
};

export default function TestimonialCard({ testimonial, index }) {
  const { lang, t } = useLang();
  const comment = typeof testimonial.comment === 'object' ? testimonial.comment[lang] : testimonial.comment;
  const service = typeof testimonial.service === 'object' ? testimonial.service[lang] : testimonial.service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="card-glass p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-gray-300 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300"
    >
      {/* Glow accent */}
      <div
        className="absolute top-0 inset-x-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${testimonial.color}, transparent)` }}
      />

      {/* Top row: platform badge + stars */}
      <div className="flex items-center justify-between">
        <PlatformBadge platform={testimonial.platform} />
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Service type */}
      <p className="text-xs font-mono text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: testimonial.color }}
        />
        {service}
      </p>

      {/* Comment */}
      <div className="relative">
        <span
          className="absolute text-5xl font-serif leading-none opacity-10 select-none inset-inline-start-0 top-0"
          style={{ color: testimonial.color }}
        >
          "
        </span>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pt-2 px-4">
          {comment}
        </p>
      </div>

      {/* Footer: author + link */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/8">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}88)` }}
          >
            {testimonial.initials || testimonial.name?.[0]}
          </div>
          <div>
            <p className="font-display font-semibold text-sm text-gray-900 dark:text-white">
              {testimonial.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t.testimonials.viewRating.replace('عرض التقييم', '').replace('View Rating', '')}
            </p>
          </div>
        </div>

        {/* View rating button */}
        {testimonial.link && (
          <a
            href={testimonial.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm"
            style={{
              color: testimonial.color,
              borderColor: testimonial.color + '40',
              background: testimonial.color + '10',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = testimonial.color + '20'; }}
            onMouseLeave={e => { e.currentTarget.style.background = testimonial.color + '10'; }}
          >
            <ExternalLink size={11} />
            {t.testimonials.viewRating}
          </a>
        )}
      </div>
    </motion.div>
  );
}
