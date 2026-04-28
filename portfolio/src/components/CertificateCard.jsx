import { motion } from 'framer-motion';
import { Award, ZoomIn } from 'lucide-react';
import { useLang } from '../context/LangContext';

const badgeColors = {
  Internship: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  DEPI:       'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Workshop:   'bg-rose-500/15 text-rose-400 border-rose-500/25',
  Program:    'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'CS Basics':'bg-orange-500/15 text-orange-400 border-orange-500/25',
};

export default function CertificateCard({ cert, index, onOpen }) {
  const { lang } = useLang();
  const title       = cert.title[lang];
  const type        = cert.type[lang];
  const description = cert.description[lang];
  const viewLabel   = lang === 'ar' ? 'عرض الشهادة' : 'View Certificate';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card-glass group overflow-hidden flex flex-col hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
    >
      {/* ── Thumbnail ─────────────────────────────────── */}
      <button
        onClick={() => onOpen(cert)}
        className="relative block w-full overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0"
        style={{ paddingBottom: '56.25%' /* 16:9 */ }}
        aria-label={viewLabel}
      >
        <img
          src={cert.image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* colour tint overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ background: cert.color }}
        />

        {/* zoom icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <ZoomIn size={18} className="text-white" />
          </div>
        </div>

        {/* badge pill top-start */}
        <div className="absolute top-2.5 start-2.5">
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${badgeColors[cert.badge] ?? 'bg-white/10 text-white border-white/20'}`}>
            {cert.badge}
          </span>
        </div>
      </button>

      {/* ── Body ──────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">

        {/* type label */}
        <div className="flex items-center gap-1.5">
          <Award size={11} style={{ color: cert.color }} />
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest ltr:tracking-widest">
            {type}
          </span>
        </div>

        {/* title */}
        <h3 className="font-display font-semibold text-sm leading-snug text-gray-900 dark:text-white">
          {title}
        </h3>

        {/* description */}
        <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* footer */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-white/8 mt-auto">
          <span className="text-[11px] text-gray-400 dark:text-gray-600 font-mono">
            {cert.platform} · {cert.year}
          </span>
          <button
            onClick={() => onOpen(cert)}
            className="text-[11px] font-semibold transition-colors"
            style={{ color: cert.color }}
          >
            {viewLabel} →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
