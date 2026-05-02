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
  return images.length ? images : ['https://placehold.co/1200x675/e5e7eb/111827?text=Project+Preview'];
};

const getProjectVideos = (project) => {
  const list = [];
  if (Array.isArray(project?.videos)) list.push(...project.videos.filter(Boolean));
  if (project?.video) list.push(project.video);
  if (project?.videoUrl) list.push(project.videoUrl);
  return [...new Set(list.filter(Boolean))];
};

const youtubeEmbed = (url) => {
  if (!url || typeof url !== 'string') return '';
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return '';
};

const vimeoEmbed = (url) => {
  if (!url || typeof url !== 'string') return '';
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ? `https://player.vimeo.com/video/${match[1]}` : '';
};

const isDirectVideo = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || '') || String(url || '').includes('/video/upload/');

function VideoBlock({ src, title, index }) {
  const yt = youtubeEmbed(src);
  const vm = vimeoEmbed(src);
  const embed = yt || vm;

  return (
    <figure className="border-b border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/15 sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        <PlayCircle size={17} className="text-accent" />
        <span>{title} video {index + 1}</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-sm dark:border-white/10">
        {embed ? (
          <iframe
            src={embed}
            title={`${title} video ${index + 1}`}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : isDirectVideo(src) ? (
          <video src={src} controls className="aspect-video w-full bg-black" preload="metadata" />
        ) : (
          <a href={src} target="_blank" rel="noopener noreferrer" className="flex aspect-video items-center justify-center gap-2 text-white">
            <ExternalLink size={18} /> Open video
          </a>
        )}
      </div>
    </figure>
  );
}

export default function ProjectModal({ project, projects = [], onClose, onSelectProject }) {
  const { lang, isRTL } = useLang();
  const moreRef = useRef(null);

  const title = getLocalizedValue(project?.title, lang);
  const description = getLocalizedValue(project?.description, lang);
  const category = lang === 'ar' ? (project?.categoryAr || project?.category) : project?.category;
  const images = useMemo(() => safeImages(project), [project]);
  const videos = useMemo(() => getProjectVideos(project), [project]);
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
    } catch {}
  };

  const scrollMore = (dir) => {
    if (!moreRef.current) return;
    const amount = moreRef.current.clientWidth * 0.85;
    const direction = isRTL ? -dir : dir;
    moreRef.current.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/65 p-2 backdrop-blur-sm sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative mx-auto flex h-[94vh] w-full max-w-[1540px] overflow-y-auto rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-white/10 dark:bg-[#121212] dark:text-white lg:overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="flex h-full w-full flex-col lg:flex-row">
            <aside className="w-full shrink-0 border-b border-gray-200 bg-white lg:h-full lg:w-[560px] lg:border-b-0 lg:border-e dark:border-white/10 dark:bg-[#1b1b1b]">
              <div className="px-6 py-7 sm:px-8 lg:h-full lg:overflow-y-auto">
                <h2 className="mb-8 pe-12 font-display text-3xl font-bold leading-tight text-gray-950 dark:text-white sm:text-4xl">
                  {title}
                </h2>

                <div className="space-y-8 text-[15px] leading-7 text-gray-700 dark:text-gray-200">
                  <p>
                    {labels.role}. <span className="font-semibold text-gray-950 dark:text-white">{role}</span>
                  </p>

                  <div>
                    <h3 className="mb-4 font-display text-base font-semibold text-gray-900 dark:text-gray-200">
                      {labels.description}.
                    </h3>
                    <p className="leading-8 text-gray-700 dark:text-gray-100/90">{description}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 font-display text-base font-semibold text-gray-900 dark:text-gray-200">
                      {labels.skills}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech || []).map((tech) => (
                        <span key={tech} className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {labels.published} <span className="font-semibold text-gray-800 dark:text-gray-200">{published}</span>
                  </p>

                  <div className="border-t border-gray-200 pt-6 dark:border-white/10">
                    <a
                      href={`mailto:ahmedayman.soliman27@gmail.com?subject=Issue about ${encodeURIComponent(title)}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 underline underline-offset-4 transition hover:text-gray-950 dark:text-gray-200 dark:hover:text-white"
                    >
                      <AlertCircle size={15} />
                      {labels.report}
                    </a>
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:border-accent hover:text-accent dark:border-white/[0.15] dark:text-white">
                        <Github size={16} />
                        {labels.github}
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-[#071018] transition hover:bg-accent/90">
                        <ExternalLink size={16} />
                        {labels.demo}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1 overflow-visible bg-gray-50 dark:bg-[#1f1f1f] lg:overflow-y-auto">
              <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-gray-200 bg-white/90 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-[#111]/90">
                <button onClick={handleCopyLink} className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
                  {labels.copy}
                  <LinkIcon size={16} />
                </button>
                <button onClick={onClose} aria-label="Close project details" className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition hover:bg-gray-300 dark:bg-white/20 dark:text-white dark:hover:bg-white/30">
                  <X size={23} />
                </button>
              </div>

              <div className="mx-auto max-w-6xl">
                <div className="space-y-0">
                  {images.map((img, index) => (
                    <figure key={`${img}-${index}`} className="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-black/15">
                      <img src={img} alt={`${title} ${index + 1}`} className="mx-auto block w-full object-contain" loading={index === 0 ? 'eager' : 'lazy'} />
                    </figure>
                  ))}
                  {videos.map((video, index) => (
                    <VideoBlock key={`${video}-${index}`} src={video} title={title} index={index} />
                  ))}
                </div>

                {moreProjects.length > 0 && (
                  <section className="border-t border-gray-200 px-5 py-10 dark:border-white/10 sm:px-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h3 className="font-display text-xl font-bold text-gray-950 dark:text-white">{labels.more}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => scrollMore(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition hover:bg-gray-300 dark:bg-black/45 dark:text-white dark:hover:bg-black/70" aria-label="Previous projects">
                          <ChevronLeft size={18} className="rtl:scale-x-[-1]" />
                        </button>
                        <button onClick={() => scrollMore(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition hover:bg-gray-300 dark:bg-black/45 dark:text-white dark:hover:bg-black/70" aria-label="Next projects">
                          <ChevronRight size={18} className="rtl:scale-x-[-1]" />
                        </button>
                      </div>
                    </div>

                    <div ref={moreRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {moreProjects.map((item) => {
                        const moreTitle = getLocalizedValue(item.title, lang);
                        const moreImages = safeImages(item);
                        return (
                          <button key={item.id} onClick={() => onSelectProject?.(item)} className="group w-[260px] shrink-0 text-start sm:w-[320px]">
                            <div className="aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-black/25">
                              <img src={moreImages[0]} alt={moreTitle} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
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
