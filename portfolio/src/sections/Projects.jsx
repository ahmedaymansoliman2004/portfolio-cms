import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { projects as fallbackProjects } from '../data/projects';
import { useCms, cmsProjects, siteText } from '../context/CmsContext';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { useLang } from '../context/LangContext';

const ALL_KEY = '__all__';

const CATEGORIES = [
  { en: 'Machine Learning',  ar: 'تعلم الآلة' },
  { en: 'Computer Vision',   ar: 'رؤية الحاسوب' },
  { en: 'Data Analytics',    ar: 'تحليل البيانات' },
  { en: 'Data Engineering',  ar: 'هندسة البيانات' },
];

export default function Projects() {
  const { t, lang } = useLang();
  const { data: cmsData } = useCms();
  const projects = cmsProjects(cmsData, fallbackProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterKey, setFilterKey] = useState(ALL_KEY);

  const allLabel = lang === 'ar' ? 'الكل' : 'All';
  const githubLabel = lang === 'ar' ? 'عرض الكل على GitHub' : 'View all on GitHub';
  const projectsTitle = siteText(cmsData, 'projects', 'title', lang, t.projects.title);
  const sectionDesc = siteText(cmsData, 'projects', 'subtitle', lang, lang === 'ar'
    ? 'أنظمة ML متكاملة، تطبيقات رؤية الحاسوب، وخطوط أنابيب هندسة البيانات.'
    : 'End-to-end ML systems, computer vision applications, and data engineering pipelines.');

  const filtered = filterKey === ALL_KEY
    ? projects
    : projects.filter(p => p.category === filterKey);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">{t.projects.label}</p>
          <h2 className="section-heading text-gray-900 dark:text-white mb-4">{projectsTitle}</h2>
          <p className="text-gray-500 dark:text-gray-500 max-w-xl mx-auto">{sectionDesc}</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {/* All */}
          <button
            onClick={() => setFilterKey(ALL_KEY)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 ${
              filterKey === ALL_KEY
                ? 'bg-accent text-[#0A0E1A] shadow-lg shadow-accent/20'
                : 'border border-gray-200 bg-white/80 text-gray-600 hover:border-accent/40 hover:bg-accent/5 hover:text-gray-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-gray-300 dark:hover:border-accent/50 dark:hover:bg-accent/10 dark:hover:text-white'
            }`}
          >
            {allLabel}
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.en}
              onClick={() => setFilterKey(cat.en)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 ${
                filterKey === cat.en
                  ? 'bg-accent text-[#0A0E1A] shadow-lg shadow-accent/20'
                  : 'bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/15'
              }`}
            >
              {lang === 'ar' ? cat.ar : cat.en}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={setSelectedProject}
            />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/ahmedaymansoliman2004"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <Github size={15} />
            {githubLabel}
          </a>
        </motion.div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          projects={projects}
          onClose={() => setSelectedProject(null)}
          onSelectProject={setSelectedProject}
        />
      )}
    </section>
  );
}
