import { motion } from 'framer-motion';
import { Code2, Database, BrainCircuit, BarChart3 } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useCms, siteText, cmsSkills } from '../context/CmsContext';

export default function About() {
  const { t, lang } = useLang();
  const { data: cmsData } = useCms();

  const fallbackSkillGroups = [
    { icon: Code2, label: lang === 'ar' ? 'البرمجة وأدوات البيانات' : 'Programming & Data Tools', color: '#00E5FF', skills: ['Python', 'Jupyter Notebook', 'Pandas', 'NumPy'] },
    { icon: BarChart3, label: lang === 'ar' ? 'تحليل البيانات والتصور البياني' : 'Data Analysis & Visualization', color: '#22C55E', skills: ['EDA', 'Data Cleaning', 'Data Filtering', 'Statistical Analysis', 'Dataset Exploration', 'Matplotlib', 'Seaborn', 'Data Visualization'] },
    { icon: BarChart3, label: lang === 'ar' ? 'ذكاء الأعمال' : 'Business Intelligence', color: '#8B5CF6', skills: ['Power BI', 'Tableau', 'Microsoft Excel', 'Dashboard Design', 'Pivot Tables', 'Pivot Charts', 'Slicers', 'KPI Tracking', 'Business Intelligence'] },
    { icon: BrainCircuit, label: lang === 'ar' ? 'تعلم الآلة' : 'Machine Learning', color: '#F59E0B', skills: ['Scikit-learn', 'XGBoost', 'Regression', 'Classification', 'Clustering', 'K-Means', 'DBSCAN', 'Feature Engineering', 'Model Training', 'Model Evaluation'] },
    { icon: BrainCircuit, label: lang === 'ar' ? 'التعلم العميق ورؤية الحاسوب' : 'Deep Learning & Computer Vision', color: '#EC4899', skills: ['TensorFlow', 'Keras', 'CNN', 'Transfer Learning', 'MobileNetV2', 'YOLOv8', 'Ultralytics', 'OpenCV', 'Image Classification', 'Object Detection', 'Real-Time Inference'] },
    { icon: Database, label: lang === 'ar' ? 'قواعد البيانات ونمذجة البيانات' : 'Databases & Data Modeling', color: '#06B6D4', skills: ['MySQL', 'Data Modeling', 'Star Schema', 'Data Preprocessing', 'Data Scaling'] },
    { icon: BarChart3, label: lang === 'ar' ? 'تحليلات الأعمال' : 'Business Analytics', color: '#10B981', skills: ['Sales Analytics', 'Customer Analytics', 'Marketing Analytics', 'Revenue Analysis', 'Sports Analytics', 'Performance Analysis'] },
    { icon: Code2, label: lang === 'ar' ? 'تطوير التطبيقات' : 'Application Development', color: '#6366F1', skills: ['Flask', 'PyQt', 'Tkinter', 'GUI Development', 'Prediction App Development'] },
    { icon: Code2, label: lang === 'ar' ? 'القيادة وإدارة المشاريع' : 'Leadership & Project Management', color: '#F97316', skills: ['Team Leadership', 'Task Coordination', 'Project Planning', 'Documentation', 'Presentation Skills', 'Team Collaboration'] },
    { icon: Code2, label: lang === 'ar' ? 'المهارات الشخصية' : 'Soft Skills', color: '#A855F7', skills: ['Problem Solving', 'Analytical Thinking', 'Fast Learning', 'Self-Learning', 'Attention to Detail', 'Communication', 'Adaptability', 'Critical Thinking', 'Research Skills', 'Time Management', 'Ownership Mindset'] },
  ];
  const iconMap = { BrainCircuit, Database, BarChart3, Code2 };

  const getSkillGroupLabel = (group) => {
    if (lang === 'ar') {
      return group.category_ar || group.title_ar || group.label_ar || group.name_ar || group.label || group.category || '';
    }

    return group.category_en || group.title_en || group.label_en || group.name_en || group.category || group.label || '';
  };

  const getSkillGroupKey = (group, index) => {
    return group.id || group.category_en || group.title_en || group.name_en || group.category || `skill-group-${index}`;
  };

  const skillGroups = cmsSkills(cmsData, fallbackSkillGroups, lang).map((group, index) => ({
    ...group,
    displayLabel: getSkillGroupLabel(group),
    stableKey: getSkillGroupKey(group, index),
    icon: group.icon || iconMap[group.iconKey] || Code2,
  }));
  const aboutTitle = siteText(cmsData, 'about', 'title', lang, t.about.title);
  const aboutSubtitle = siteText(cmsData, 'about', 'subtitle', lang, t.about.subtitle);

  const renderBio = (text) => {
    return text.split('<accent>').map((part, i) => {
      if (i === 0) return part;
      const [accentPart, rest] = part.split('</accent>');
      return (
        <span key={i}>
          <span className="text-accent font-medium">{accentPart}</span>
          {rest}
        </span>
      );
    });
  };

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">{t.about.label}</p>
          <h2 className="section-heading text-gray-900 dark:text-white mb-4">{aboutTitle}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">{aboutSubtitle}</p>
        </motion.div>

        <div className="space-y-10">
          {/* Professional Summary */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="card-glass p-7 sm:p-8 lg:p-10 rounded-2xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="font-mono text-xs text-accent tracking-widest uppercase mb-2">
                    {lang === 'ar' ? 'ملخص مهني' : 'Profile'}
                  </p>
                  <h3 className="font-display font-semibold text-2xl text-gray-900 dark:text-white">
                    {t.about.summaryTitle}
                  </h3>
                </div>
              </div>

              <div className="space-y-7">
                <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-8">
                  <p>{renderBio(t.about.bio1)}</p>
                  <p>{t.about.bio2}</p>
                  <p>{t.about.bio3}</p>
                  <p>{t.about.bio4}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-gray-200/70 dark:border-white/10 pt-6">
                  {[
                    { value: cmsData?.about?.stats?.projects || '9+', label: t.about.stats.projects },
                    { value: cmsData?.about?.stats?.gpa || '3.63', label: t.about.stats.gpa },
                    { value: cmsData?.about?.stats?.internships || '2+', label: t.about.stats.internships },
                  ].map(stat => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] p-4 sm:p-5 text-center"
                    >
                      <p className="font-display font-bold text-2xl sm:text-3xl text-accent">{stat.value}</p>
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-7 text-center">
              <p className="font-mono text-xs text-accent tracking-widest uppercase mb-2">
                {lang === 'ar' ? 'مجالاتي التقنية' : 'Core Skill Areas'}
              </p>
              <h3 className="font-display font-semibold text-2xl text-gray-900 dark:text-white">
                {lang === 'ar' ? 'المهارات' : 'Skills'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {skillGroups.map((group, i) => {
                const Icon = group.icon;
                return (
                  <motion.div
                    key={group.stableKey}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.45 }}
                    className="card-glass p-5 sm:p-6 rounded-2xl hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: group.color + '15', border: `1px solid ${group.color}30` }}
                      >
                        <Icon size={17} style={{ color: group.color }} />
                      </div>
                      <h4 className="font-display font-semibold text-base text-gray-800 dark:text-white leading-snug">
                        {group.displayLabel}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill, skillIndex) => (
                        <span key={`${group.stableKey}-${skill}-${skillIndex}`} className="tech-tag">{skill}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
