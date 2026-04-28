import certCodeOrg      from '../assets/cert-code-org.jpg';
import certMsaCyber     from '../assets/cert-msa-cyber.jpg';
import certMsaInterview from '../assets/cert-msa-interview.jpg';
import certMsaExpert    from '../assets/cert-msa-expert.jpg';
import certElevvoMl     from '../assets/cert-elevvo-ml.jpg';
import certEncryptCore  from '../assets/cert-encryptcore.jpg';
import certDepiEnglish  from '../assets/cert-depi-english.jpg';
import certDepiGoogle   from '../assets/cert-depi-google.jpg';

export const certificates = [
  {
    id: 1,
    title: { en: 'Machine Learning Internship', ar: 'تدريب تعلم الآلة' },
    type:  { en: 'Certificate of Achievement', ar: 'شهادة إنجاز' },
    platform: 'Elevvo',
    year: 'Mar 2026',
    description: {
      en: 'Successful completion of the 1-month Machine Learning Internship Program.',
      ar: 'إتمام برنامج التدريب على تعلم الآلة لمدة شهر واحد.',
    },
    image: certElevvoMl,
    color: '#6366f1',
    icon: '🤖',
    badge: 'Internship',
  },
  {
    id: 2,
    title: { en: 'Google Data Analyst Specialist', ar: 'أخصائي تحليل بيانات Google' },
    type:  { en: 'Certificate of Achievement', ar: 'شهادة إنجاز' },
    platform: 'DEPI · Egypt MCIT',
    year: 'May 2025',
    description: {
      en: 'Completed the Data Analytics – Google Data Analyst Specialist track under the Digital Egypt Pioneers Program (Nov 2024 – May 2025).',
      ar: 'إتمام مسار تحليل البيانات – أخصائي Google لتحليل البيانات ضمن مبادرة رواد مصر الرقمية.',
    },
    image: certDepiGoogle,
    color: '#4285F4',
    icon: '📊',
    badge: 'DEPI',
  },
  {
    id: 3,
    title: { en: 'Business English Track', ar: 'مسار الإنجليزية للأعمال' },
    type:  { en: 'Certificate of Completion', ar: 'شهادة إتمام' },
    platform: 'DEPI · Egypt MCIT',
    year: 'May 2025',
    description: {
      en: 'Completed Round 2 of the Business English Track under the Digital Egypt Pioneers Initiative, delivered by SYE English Community.',
      ar: 'إتمام الجولة الثانية من مسار اللغة الإنجليزية للأعمال ضمن مبادرة رواد مصر الرقمية.',
    },
    image: certDepiEnglish,
    color: '#16a34a',
    icon: '🌍',
    badge: 'DEPI',
  },
  {
    id: 4,
    title: { en: 'IT Internship – Networking & AI', ar: 'تدريب تقنية المعلومات – شبكات وذكاء اصطناعي' },
    type:  { en: 'Certificate of Course Completion', ar: 'شهادة إتمام دورة' },
    platform: 'EncryptCore',
    year: '2024',
    description: {
      en: 'Communication Networks & AI Internship: OSI Model, IP/TCP/UDP, Cisco Packet Tracer, ML, CNNs, and AI model deployment.',
      ar: 'تدريب شبكات الاتصالات والذكاء الاصطناعي: نموذج OSI، بروتوكولات، Cisco، تعلم الآلة ونشر النماذج.',
    },
    image: certEncryptCore,
    color: '#b45309',
    icon: '🔐',
    badge: 'Internship',
  },
  {
    id: 5,
    title: { en: 'Cyber Violence Workshop', ar: 'ورشة العنف الإلكتروني' },
    type:  { en: 'Certificate of Appreciation', ar: 'شهادة تقدير' },
    platform: 'MSA University',
    year: '2023',
    description: {
      en: 'Recognized for participation enhancing awareness of online violence against women and promoting digital safety.',
      ar: 'تقدير للمشاركة في تعزيز الوعي بالعنف الإلكتروني ضد المرأة والسلامة الرقمية.',
    },
    image: certMsaCyber,
    color: '#dc2626',
    icon: '🛡️',
    badge: 'Workshop',
  },
  {
    id: 6,
    title: { en: 'Interviewing Skills Workshop', ar: 'ورشة مهارات المقابلات' },
    type:  { en: 'Certificate of Participation', ar: 'شهادة مشاركة' },
    platform: 'MSA University – CLC',
    year: 'Sep 2023',
    description: {
      en: 'Active participation in the Interviewing Skills Online Workshop hosted by MSA Continuance Learning Center.',
      ar: 'مشاركة فعّالة في ورشة مهارات المقابلات الإلكترونية بمركز التعلم المستمر بجامعة MSA.',
    },
    image: certMsaInterview,
    color: '#0891b2',
    icon: '💼',
    badge: 'Workshop',
  },
  {
    id: 7,
    title: { en: 'Meet Your Expert', ar: 'قابل خبيرك' },
    type:  { en: 'Certificate of Attendance', ar: 'شهادة حضور' },
    platform: 'MSA University – CLC',
    year: 'Dec 2023',
    description: {
      en: 'Completed "Meet Your Expert" as part of the Job-Hunting Employability Program.',
      ar: 'إتمام جلسة "قابل خبيرك" ضمن برنامج التوظيف وصيد الوظائف.',
    },
    image: certMsaExpert,
    color: '#7c3aed',
    icon: '🎯',
    badge: 'Program',
  },
  {
    id: 8,
    title: { en: 'The Hour of Code', ar: 'ساعة البرمجة' },
    type:  { en: 'Certificate of Completion', ar: 'شهادة إتمام' },
    platform: 'Code.org',
    year: '2023',
    description: {
      en: 'Demonstrated understanding of basic Computer Science concepts through the Hour of Code program.',
      ar: 'إثبات فهم المفاهيم الأساسية لعلوم الحاسوب من خلال برنامج ساعة البرمجة.',
    },
    image: certCodeOrg,
    color: '#ea580c',
    icon: '💻',
    badge: 'CS Basics',
  },
];
