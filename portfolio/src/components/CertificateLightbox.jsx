import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function CertificateLightbox({ cert, certs, onClose, onNavigate }) {
  const { lang, isRTL } = useLang();
  if (!cert) return null;

  const title       = cert.title[lang];
  const type        = cert.type[lang];
  const description = cert.description[lang];

  const currentIndex = certs.findIndex(c => c.id === cert.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < certs.length - 1;

  // Close on Escape, navigate with arrow keys
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  isRTL ? (hasNext && onNavigate(certs[currentIndex + 1])) : (hasPrev && onNavigate(certs[currentIndex - 1]));
      if (e.key === 'ArrowRight') isRTL ? (hasPrev && onNavigate(certs[currentIndex - 1])) : (hasNext && onNavigate(certs[currentIndex + 1]));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cert, certs, currentIndex, hasPrev, hasNext, isRTL]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const closeLabel = lang === 'ar' ? 'إغلاق' : 'Close';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
        dir={isRTL ? 'rtl' : 'ltr'}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#0e0e14] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Certificate image */}
          <div className="relative bg-gray-50 dark:bg-white/5 flex items-center justify-center overflow-hidden"
               style={{ maxHeight: '60vh' }}>
            <img
              src={cert.image}
              alt={title}
              className="w-full h-auto max-h-[60vh] object-contain"
            />

            {/* Nav buttons over image */}
            {hasPrev && (
              <button
                onClick={() => onNavigate(certs[currentIndex - 1])}
                className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={16} className="rtl:scale-x-[-1]" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => onNavigate(certs[currentIndex + 1])}
                className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={16} className="rtl:scale-x-[-1]" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 end-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label={closeLabel}
            >
              <X size={15} />
            </button>

            {/* Dot indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {certs.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => onNavigate(certs[i])}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: i === currentIndex ? cert.color : 'rgba(255,255,255,0.35)',
                    transform: i === currentIndex ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Info footer */}
          <div className="px-5 py-4 flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
              style={{ background: cert.color + '22', border: `1px solid ${cert.color}44` }}
            >
              {cert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Award size={10} style={{ color: cert.color }} />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{type}</span>
              </div>
              <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white leading-snug mb-1">
                {title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-600 font-mono mt-2">
                {cert.platform} · {cert.year}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
