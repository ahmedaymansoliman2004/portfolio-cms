import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useCms, cmsExperience, siteText } from '../context/CmsContext';

const experienceData = {
  ar: [
    { role: 'متدرب تقنية المعلومات (مهندس ذكاء اصطناعي)', company: 'Encryptcore', period: 'أغسطس 2026 – سبتمبر 2026', type: 'work', bullets: ['طور نظام اكتشاف قواعد اللباس بالذكاء الاصطناعي باستخدام YOLOv8', 'عمل مع 2700+ صورة مُصنَّفة واستدلال OpenCV في الوقت الفعلي'], color: '#8B5CF6' },
    { role: 'متدرب تعلم الآلة', company: 'Elevvo Pathways', period: 'فبراير 2026 – مارس 2026', type: 'work', bullets: ['أتم مهام تعلم الآلة في المعالجة المسبقة والنمذجة والتقييم', 'طبّق تقنيات التعلم المُشرف على مجموعات بيانات حقيقية'], color: '#00E5FF' },
    { role: 'متدرب هندسة البيانات', company: 'مبادرة مصر الرقمية (DEPI)', period: 'نوفمبر 2025 – الآن', type: 'work', bullets: ['بناء خطوط أنابيب ETL باستخدام Python وSQL وأساسيات Azure', 'العمل على سير بيانات وأتمتة ومفاهيم Big Data', 'قيادة فريق من 6 أعضاء في مشروع ETL'], color: '#22C55E' },
    { role: 'مهندس تعلم آلة حر', company: 'مستقل وخمسات', period: 'مايو 2024 – الآن', type: 'work', bullets: ['بنى نماذج ML للانحدار والتصنيف', 'أجرى معالجة بيانات وهندسة ميزات ونشر نماذج'], color: '#F59E0B' },
    { role: 'متدرب تحليل البيانات', company: 'مبادرة مصر الرقمية (DEPI)', period: 'نوفمبر 2024 – مايو 2025', type: 'work', bullets: ['حلّل 31 ألف+ سجل سكك حديدية بريطانية بـPython وSQL', 'بنى لوحات Power BI لمؤشرات الأداء والتوجهات', 'قاد فريقًا تحليليًا من 4 أعضاء'], color: '#EC4899' },
    { role: 'طالب نظم معلومات إدارية', company: 'جامعة MSA', period: '2023 – يونيو 2027', type: 'edu', bullets: ['كلية علوم الإدارة – نظم المعلومات الإدارية', 'المعدل: 3.63 / 4.00 (مصري) · 3.73 / 4.00 (بريطاني)'], color: '#06B6D4' },
  ],
  en: [
    { role: 'IT Intern (AI Engineer)', company: 'Encryptcore', period: 'Aug 2026 – Sep 2026', type: 'work', bullets: ['Developed AI-based dress code detection system using YOLOv8', 'Worked with 2,700+ labeled images and real-time OpenCV inference'], color: '#8B5CF6' },
    { role: 'Machine Learning Intern', company: 'Elevvo Pathways', period: 'Feb 2026 – Mar 2026', type: 'work', bullets: ['Completed ML tasks covering preprocessing, modeling, and evaluation', 'Applied supervised learning techniques on real datasets'], color: '#00E5FF' },
    { role: 'Data Engineering Trainee', company: 'Digital Egypt Pioneers Initiative (DEPI)', period: 'Nov 2025 – Present', type: 'work', bullets: ['Building ETL pipelines using Python, SQL, and Azure basics', 'Working on data workflows, automation, and Big Data concepts', 'Leading a 6-member team in ETL pipeline project'], color: '#22C55E' },
    { role: 'Freelance ML Engineer', company: 'Mostaql & Khamsat', period: 'May 2024 – Present', type: 'work', bullets: ['Built ML models for regression and classification problems', 'Performed data preprocessing, feature engineering, and deployment'], color: '#F59E0B' },
    { role: 'Data Analysis Trainee', company: 'Digital Egypt Pioneers Initiative (DEPI)', period: 'Nov 2024 – May 2025', type: 'work', bullets: ['Analyzed 31K+ UK railway records using Python and SQL', 'Built Power BI dashboards for KPIs and trends', 'Led a 4-member analytics team'], color: '#EC4899' },
    { role: 'MIS Student', company: 'MSA University', period: '2023 – Jun 2027', type: 'edu', bullets: ['Faculty of Management Sciences – Management Information Systems', 'GPA: 3.63 / 4.00 (Egyptian) · 3.73 / 4.00 (British)'], color: '#06B6D4' },
  ],
};

export default function Experience() {
  const { t, lang } = useLang();
  const { data: cmsData } = useCms();
  const experience = cmsExperience(cmsData, lang, experienceData[lang]);
  const experienceTitle = siteText(cmsData, 'experience', 'title', lang, t.experience.title);
  const experienceSubtitle = siteText(cmsData, 'experience', 'subtitle', lang, '');

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">{t.experience.label}</p>
          <h2 className="section-heading text-gray-900 dark:text-white mb-4">{experienceTitle}</h2>
          {experienceSubtitle && <p className="text-gray-500 dark:text-gray-500 max-w-lg mx-auto text-sm">{experienceSubtitle}</p>}
        </motion.div>

        <div className="relative">
          {/* Vertical line — center on md, inline-start on mobile */}
          <div className="absolute inset-inline-start-6 md:inset-inline-start-auto md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10" />

          <div className="space-y-10">
            {experience.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative flex items-start gap-6 flex-row ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div
                  className="absolute inset-inline-start-6 md:inset-inline-start-auto md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full border-2 z-10 mt-5"
                  style={{ background: item.color + '30', borderColor: item.color }}
                />

                {/* Card */}
                <div className="w-full md:w-[calc(50%-2rem)] ms-12 md:ms-0">
                  <div className="card-glass p-5 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: item.color + '15', border: `1px solid ${item.color}30` }}
                      >
                        {item.type === 'edu'
                          ? <GraduationCap size={14} style={{ color: item.color }} />
                          : <Briefcase size={14} style={{ color: item.color }} />
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-white leading-snug">{item.role}</h3>
                        <p className="text-xs font-medium mt-0.5" style={{ color: item.color }}>{item.company}</p>
                        <p className="font-mono text-xs text-gray-400 dark:text-gray-600 mt-0.5">{item.period}</p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {item.bullets.map((b, j) => (
                        <li key={j} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                          <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: item.color }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
