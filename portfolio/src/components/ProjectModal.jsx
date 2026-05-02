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
  PlayCircle,
} from 'lucide-react';
import { useLang } from '../context/LangContext';

const getLocalizedValue = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') return value?.[lang] || value?.en || value?.ar || '';
  return value;
};

const safeImages = (project) => {
  const images = Array.isArray(project?.images) ? project.images.filter(Boolean) : [];
  return images.length ? images : ['https://placehold.co/1200x675/f8fafc/0f172a?text=Project+Preview'];
};

const getVideoUrl = (project) => project?.video || project?.video_url || project?.videoUrl || project?.demoVideo || '';

const isDirectVideo = (url = '') => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

const toEmbedUrl = (url = '') => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (host.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (host.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }
  } catch {
    return url;
  }
  return url;
};

export default function ProjectModal({ project, projects = [], onClose, onSelectProject }) {
  const { lang, isRTL } = useLang();
  const moreRef = useRef(null);

  const title = getLocalizedValue(project?.title, lang);
  const description = getLocalizedValue(project?.description, lang);
  const category = lang === 'ar' ? (project?.categoryAr || project?.category) : project?.category;
  const images = useMemo(() => safeImages(project), [project]);
  const videoUrl = getVideoUrl(project);
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
    video: lang === 'ar' ? 'فيديو المشروع' : 'Project video',
    more: lang === 'ar' ? 'المزيد من المشاريع' : 'More Projects',
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

  const renderVideo = () => {
    if (!videoUrl) return null;
    return (
      <section className="border-b border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/15 sm:p-6">
        <div className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-gray-900 dark:text-white">
          <PlayCircle size={18} className="text-accent" />
          {labels.video}
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-sm dark:border-white/10">
          {isDirectVideo(videoUrl) ? (
            <video src={videoUrl} controls className="block aspect-video w-full bg-black" />
          ) : (
            <iframe
              src={toEmbedUrl(videoUrl)}
              title={`${title} video`}
              className="block aspect-video w-full bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </section>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 p-2 backdrop-blur-sm sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative mx-auto flex h-[94vh] w-full max-w-[1540px] overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-white/10 dark:bg-[#121212] dark:text-white"
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <button
            onClick={onClose}
            aria-label="Close project details"
            className="absolute end-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900/10 text-gray-700 backdrop-blur-md transition hover:bg-gray-900/20 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
          >
            <X size={24} />
          </button>

          <div className="flex h-full w-full flex-col lg:flex-row">
            {/* Details sidebar */}
            <aside className="w-full shrink-0 border-b border-gray-200 bg-white lg:h-full lg:w-[620px] lg:border-b-0 lg:border-e lg:border-gray-200 dark:border-white/10 dark:bg-[#1b1b1b]">
              <div className="h-full overflow-y-auto px-6 py-7 sm:px-9">
                <h2 className="mb-8 pe-12 font-display text-3xl font-bold leading-tight text-gray-950 dark:text-white sm:text-4xl">
                  {title}
                </h2>

                <div className="space-y-8 text-[15px] leading-7 text-gray-700 dark:text-gray-200">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {labels.role}. <span className="font-semibold text-gray-950 dark:text-white">{role}</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-4 font-display text-base font-semibold text-gray-800 dark:text-gray-200">
                      {labels.description}.
                    </h3>
                    <p className="leading-8 text-gray-700 dark:text-gray-100/90">{description}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 font-display text-base font-semibold text-gray-800 dark:text-gray-200">
                      {labels.skills}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech || []).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-white/12 dark:text-white/90"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {labels.published} <span className="font-semibold text-gray-700 dark:text-gray-200">{published}</span>
                  </p>

                  <div className="border-t border-gray-200 pt-6 dark:border-white/10">
                    <a
                      href={`mailto:ahmedayman.soliman27@gmail.com?subject=Issue about ${encodeURIComponent(title)}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 underline underline-offset-4 transition hover:text-gray-950 dark:text-gray-200 dark:hover:text-white"
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
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-white/15 dark:text-white"
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
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#1f1f1f]">
              <div className="sticky top-0 z-30 flex items-center justify-start gap-3 border-b border-gray-200 bg-white/90 px-6 py-4 pe-20 backdrop-blur-md dark:border-white/10 dark:bg-[#111]/90">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
                >
                  {labels.copy}
                  <LinkIcon size={16} />
                </button>
              </div>

              <div className="mx-auto max-w-6xl">
                {renderVideo()}

                <div className="space-y-0">
                  {images.map((img, index) => (
                    <figure key={`${img}-${index}`} className="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-black/15">
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
                  <section className="border-t border-gray-200 px-5 py-10 dark:border-white/10 sm:px-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h3 className="font-display text-xl font-bold text-gray-950 dark:text-white">{labels.more}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => scrollMore(-1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/10 text-gray-700 transition hover:bg-gray-900/20 dark:bg-black/45 dark:text-white dark:hover:bg-black/70"
                          aria-label="Previous projects"
                        >
                          <ChevronLeft size={18} className="rtl:scale-x-[-1]" />
                        </button>
                        <button
                          onClick={() => scrollMore(1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/10 text-gray-700 transition hover:bg-gray-900/20 dark:bg-black/45 dark:text-white dark:hover:bg-black/70"
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
                            <div className="aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-black/25">
                              <img
                                src={moreImages[0]}
                                alt={moreTitle}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            <h4 className="mt-4 line-clamp-2 font-display text-base font-semibold leading-snug text-gray-900 transition group-hover:text-accent dark:text-white">
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
