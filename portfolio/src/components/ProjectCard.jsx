import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function ProjectCard({ project, onClick, index }) {
  const { lang, t } = useLang();
  const title    = typeof project.title    === 'object' ? project.title[lang]    : project.title;
  const shortDesc= typeof project.shortDesc=== 'object' ? project.shortDesc[lang]: project.shortDesc;
  const category = lang === 'ar' ? (project.categoryAr || project.category) : project.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onClick={() => onClick(project)}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-white/5">
        <img
          src={project.images[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 start-3">
          <span
            className="text-xs font-mono font-medium px-2.5 py-1 rounded-full backdrop-blur-sm text-white"
            style={{ background: project.color + '40', border: `1px solid ${project.color}50` }}
          >
            {category}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-base text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-2">
          {shortDesc}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
          {project.tech.length > 4 && (
            <span className="tech-tag text-gray-400">+{project.tech.length - 4}</span>
          )}
        </div>

        <button
          className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-display font-medium text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200 group/btn flex items-center justify-center gap-2"
          onClick={e => { e.stopPropagation(); onClick(project); }}
        >
          {lang === 'ar' ? 'عرض المشروع' : 'View Project'}
          <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
