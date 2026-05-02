import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Github,
  ExternalLink,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useLang } from '../context/LangContext';

const getLocalizedValue = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') return value?.[lang] || value?.en || value?.ar || '';
  return value;
};

const safeImages = (project) => {
  const images = Array.isArray(project?.images) ? project.images.filter(Boolean) : [];
  return images.length ? images : ['https://placehold.co/1200x675/0d1220/ffffff?text=Project+Preview'];
};

export default function ProjectModal({ project, projects = [], onClose, onSelectProject }) {
  const { lang, isRTL } = useLang();
  const moreRef = useRef(null);

  const title = getLocalizedValue(project?.title, lang);
  const description = getLocalizedValue(project?.description, lang);
  const category = lang === 'ar' ? (project?.categoryAr || project?.category) : project?.category;
  const images = useMemo(() => safeImages(project), [project]);
  const moreProjects = useMemo(
    () => projects.filter((item) => item.id !== project?.id),
    [projects, project?.id]
  );

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;

  const labels = {
    role: lang === 'ar' ? 'دوري' : 'My role',
    description: lang === 'ar' ? 'وصف المشروع' : 'Project description',
    skills: lang === 'ar' ? 'المهارات والمخرجات' : 'Skills and deliverables',
    published: lang === 'ar' ? 'تاريخ النشر' : 'Published on',
    report: lang === 'ar' ? 'الإبلاغ عن مشكلة' : 'Report an issue',
    copy: lang === 'ar' ? 'نسخ الرابط' : 'Copy link',
    github: lang === 'ar' ? 'عرض على GitHub' : 'View on GitHub',
    demo: lang === 'ar' ? 'عرض مباشر' : 'Live Demo',
    more: lang === 'ar' ? 'مشاريع أخرى' : 'More Projects',
    noDate: lang === 'ar' ? 'غير محدد' : 'Not specified',
  };

  const role = project.role || project.role_en || (category || (lang === 'ar' ? 'مشروع' : 'Project'));
  const published = project.date || project.published || project.year || labels.noDate;

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#projects`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard can fail on some browsers without HTTPS permissions.
    }
  };

  const scrollMore = (dir) => {
    if (!moreRef.current) return;
    const amount = moreRef.current.clientWidth * 0.85;
    const direction = isRTL ? -dir : dir;
    moreRef.current.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  const selectMoreProject = (item) => {
    if (onSelectProject) onSelectProject(item);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative mx-auto flex h-[94vh] w-full max-w-[1520px] overflow-hidden rounded-2xl border border-white/10 bg-[#121212] text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <button
            onClick={onClose}
            aria-label="Close project details"
            className="absolute right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
          >
            <X size={24} />
          </button>

          <div className="flex h-full w-full flex-col lg:flex-row">
            {/* Details sidebar */}
            <aside className="w-full shrink-0 border-b border-white/10 bg-[#1b1b1b] lg:h-full lg:w-[540px] lg:border-b-0 lg:border-e lg:border-white/10">
              <div className="h-full overflow-y-auto px-6 py-7 sm:px-8">
                <h2 className="mb-8 pe-12 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {title}
                </h2>

                <div className="space-y-8 text-[15px] leading-7 text-gray-200">
                  <div>
                    <p className="text-gray-300">
                      {labels.role}. <span className="font-semibold text-white">{role}</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-4 font-display text-base font-semibold text-gray-200">
                      {labels.description}.
                    </h3>
                    <p className="text-gray-100/90 leading-8">{description}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 font-display text-base font-semibold text-gray-200">
                      {labels.skills}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech || []).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-white/12 px-3 py-1 text-sm font-medium text-white/90"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-300">
                    {labels.published} <span className="font-semibold text-gray-200">{published}</span>
                  </p>

                  <div className="border-t border-white/10 pt-6">
                    <a
                      href={`mailto:ahmedayman.soliman27@gmail.com?subject=Issue about ${encodeURIComponent(title)}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-200 underline underline-offset-4 transition hover:text-white"
                    >
                      <AlertCircle size={15} />
                      {labels.report}
                    </a>
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
                      >
                        <Github size={16} />
                        {labels.github}
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-[#071018] transition hover:bg-accent/90"
                      >
                        <ExternalLink size={16} />
                        {labels.demo}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Scrollable project body */}
            <main className="flex-1 overflow-y-auto bg-[#1f1f1f]">
              <div className="sticky top-0 z-20 flex items-center justify-start gap-3 border-b border-white/10 bg-[#111]/90 px-6 py-4 pe-20 backdrop-blur-md">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-green-500 transition hover:text-green-400"
                >
                  {labels.copy}
                  <LinkIcon size={16} />
                </button>
              </div>

              <div className="mx-auto max-w-6xl">
                {/* Images stacked vertically with internal scroll */}
                <div className="space-y-0">
                  {images.map((img, index) => (
                    <figure key={`${img}-${index}`} className="border-b border-white/10 bg-black/15">
                      <img
                        src={img}
                        alt={`${title} ${index + 1}`}
                        className="mx-auto block max-h-none w-full object-contain"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </figure>
                  ))}
                </div>

                {moreProjects.length > 0 && (
                  <section className="border-t border-white/10 px-5 py-10 sm:px-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h3 className="font-display text-xl font-bold text-white">{labels.more}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => scrollMore(-1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
                          aria-label="Previous projects"
                        >
                          <ChevronLeft size={18} className="rtl:scale-x-[-1]" />
                        </button>
                        <button
                          onClick={() => scrollMore(1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
                          aria-label="Next projects"
                        >
                          <ChevronRight size={18} className="rtl:scale-x-[-1]" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={moreRef}
                      className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {moreProjects.map((item) => {
                        const moreTitle = getLocalizedValue(item.title, lang);
                        const moreImages = safeImages(item);
                        return (
                          <button
                            key={item.id}
                            onClick={() => selectMoreProject(item)}
                            className="group w-[260px] shrink-0 text-start sm:w-[320px]"
                          >
                            <div className="aspect-video overflow-hidden rounded-xl bg-black/25">
                              <img
                                src={moreImages[0]}
                                alt={moreTitle}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            <h4 className="mt-4 line-clamp-2 font-display text-base font-semibold leading-snug text-white transition group-hover:text-accent">
                              {moreTitle}
                            </h4>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            </main>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
