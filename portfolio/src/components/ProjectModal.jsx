import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Github, ExternalLink } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function ProjectModal({ project, onClose }) {
  const { lang, isRTL } = useLang();
  const [imgIndex, setImgIndex] = useState(0);

  const title       = typeof project.title       === 'object' ? project.title[lang]       : project.title;
  const description = typeof project.description === 'object' ? project.description[lang] : project.description;
  const category    = lang === 'ar' ? (project.categoryAr || project.category) : project.category;

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const prev = () => setImgIndex(i => (i - 1 + project.images.length) % project.images.length);
  const next = () => setImgIndex(i => (i + 1) % project.images.length);

  if (!project) return null;

  const techLabel    = lang === 'ar' ? 'التقنيات المستخدمة' : 'Tech Stack';
  const githubLabel  = lang === 'ar' ? 'عرض على GitHub'    : 'View on GitHub';
  const demoLabel    = lang === 'ar' ? 'عرض مباشر'          : 'Live Demo';

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#0D1220] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 z-10 w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col md:flex-row overflow-y-auto">
            {/* Image gallery */}
            <div className="w-full md:w-1/2 bg-gray-100 dark:bg-black/30 flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIndex}
                    src={project.images[imgIndex]}
                    alt={`${title} ${imgIndex + 1}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                {project.images.length > 1 && (
                  <>
                  <button onClick={prev} className="absolute start-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                      <ChevronLeft size={16} className="rtl:scale-x-[-1]" />
                    </button>
                    <button onClick={next} className="absolute end-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                      <ChevronRight size={16} className="rtl:scale-x-[-1]" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {project.images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-accent w-4' : 'bg-white/50'}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 p-3">
                {project.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIndex(i)} className={`w-16 h-10 rounded-md overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-4">
              <div>
                <span
                  className="text-xs font-mono px-2.5 py-1 rounded-full mb-3 inline-block"
                  style={{ background: project.color + '20', color: project.color, border: `1px solid ${project.color}40` }}
                >
                  {category}
                </span>
                <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-1">{title}</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
              <div>
                <p className="text-xs font-mono text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-2">{techLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-outline justify-center">
                  <Github size={15} />
                  {githubLabel}
                </a>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                    <ExternalLink size={15} />
                    {demoLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
