import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const STORAGE_KEY = 'ahmed_portfolio_cms_data';

const DEFAULT_SITE_TEXT = {
  hero: {
    subtitle_en: '',
    subtitle_ar: '',
    description_en: '',
    description_ar: '',
  },
  sections: {
    about: { title_en: 'About', title_ar: 'نبذة عني', subtitle_en: '', subtitle_ar: '' },
    skills: { title_en: 'Skills', title_ar: 'المهارات', subtitle_en: '', subtitle_ar: '' },
    projects: { title_en: 'Projects', title_ar: 'المشاريع', subtitle_en: '', subtitle_ar: '' },
    experience: { title_en: 'Experience', title_ar: 'الخبرات', subtitle_en: '', subtitle_ar: '' },
    certificates: { title_en: 'Certifications', title_ar: 'الشهادات', subtitle_en: '', subtitle_ar: '' },
    reviews: { title_en: 'Reviews', title_ar: 'آراء العملاء', subtitle_en: '', subtitle_ar: '' },
    recommendations: { title_en: 'Recommendations', title_ar: 'التوصيات', subtitle_en: '', subtitle_ar: '' },
    contact: { title_en: 'Contact', title_ar: 'تواصل معي', subtitle_en: '', subtitle_ar: '' },
  },
};

function mergeSiteText(incomingSiteText = {}) {
  const incomingSections = incomingSiteText.sections || {};
  const mergedSections = {};

  Object.keys(DEFAULT_SITE_TEXT.sections).forEach((key) => {
    mergedSections[key] = {
      ...DEFAULT_SITE_TEXT.sections[key],
      ...(incomingSections[key] || {}),
    };
  });

  return {
    ...DEFAULT_SITE_TEXT,
    ...incomingSiteText,
    hero: {
      ...DEFAULT_SITE_TEXT.hero,
      ...(incomingSiteText.hero || {}),
    },
    sections: mergedSections,
  };
}

function normalizeCmsData(incoming) {
  if (!incoming || typeof incoming !== 'object') return null;

  return {
    ...incoming,
    siteText: mergeSiteText(incoming.siteText),
    skills: Array.isArray(incoming.skills) ? incoming.skills : [],
    projects: Array.isArray(incoming.projects) ? incoming.projects : [],
    experience: Array.isArray(incoming.experience) ? incoming.experience : [],
    reviews: Array.isArray(incoming.reviews) ? incoming.reviews : [],
    recommendations: Array.isArray(incoming.recommendations) ? incoming.recommendations : [],
    certificates: Array.isArray(incoming.certificates) ? incoming.certificates : [],
  };
}

function readLocalCmsData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeCmsData(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

const CmsContext = createContext({ data: null, loading: true, refresh: () => {} });

export function CmsProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch(`${API_URL}/api/content`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const normalized = normalizeCmsData(json);

      if (normalized) {
        setData(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
    } catch {
      const localData = readLocalCmsData();
      if (localData) setData(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const safeRefresh = async () => {
      if (!active) return;
      await refresh();
    };

    safeRefresh();

    const onFocus = () => safeRefresh();
    const onVisibility = () => {
      if (!document.hidden) safeRefresh();
    };
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          setData(normalizeCmsData(JSON.parse(event.newValue)));
        } catch {}
      }
    };
    const onCmsUpdated = (event) => {
      if (event.detail) setData(normalizeCmsData(event.detail));
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('storage', onStorage);
    window.addEventListener('portfolio-cms-updated', onCmsUpdated);

    const interval = window.setInterval(safeRefresh, 15000);

    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('portfolio-cms-updated', onCmsUpdated);
      window.clearInterval(interval);
    };
  }, []);

  const value = useMemo(() => ({ data, loading, refresh }), [data, loading]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}

export function localized(item, field, lang) {
  return item?.[`${field}_${lang}`] ?? item?.[field]?.[lang] ?? item?.[field] ?? '';
}

export function siteText(cmsData, section, field, lang, fallback = '') {
  const text = section === 'hero'
    ? cmsData?.siteText?.hero?.[`${field}_${lang}`]
    : cmsData?.siteText?.sections?.[section]?.[`${field}_${lang}`];

  return text || fallback;
}

export function cmsProjects(cmsData, fallback) {
  if (!cmsData?.projects?.length) return fallback;

  return cmsData.projects.map((p) => ({
    id: p.id,
    title: { ar: p.title_ar || p.title_en || '', en: p.title_en || p.title_ar || '' },
    description: { ar: p.description_ar || p.description_en || '', en: p.description_en || p.description_ar || '' },
    shortDesc: { ar: p.description_ar || p.description_en || '', en: p.description_en || p.description_ar || '' },
    tech: Array.isArray(p.tech) ? p.tech : String(p.tech || '').split(',').map((x) => x.trim()).filter(Boolean),
    github: p.github || '',
    live: p.live || null,
    category: p.category || 'Machine Learning',
    categoryAr: p.category_ar || p.categoryAr || p.category || '',
    color: p.color || '#00E5FF',
    images: Array.isArray(p.images) ? p.images : [],
    videos: Array.isArray(p.videos) ? p.videos : [p.video || p.videoUrl].filter(Boolean),
    video: p.video || p.videoUrl || '',
    videoUrl: p.videoUrl || p.video || '',
  }));
}

export function cmsCertificates(cmsData, fallback) {
  if (!cmsData?.certificates?.length) return fallback;

  return cmsData.certificates.map((c) => {
    const badge = c.badge || c.type?.en || c.type || 'Certificate';
    const issuer = c.issuer || c.platform || '';
    const date = c.date || c.year || '';

    return {
      id: c.id,
      title: {
        ar: c.title_ar || c.title?.ar || c.title_en || c.title?.en || '',
        en: c.title_en || c.title?.en || c.title_ar || c.title?.ar || '',
      },
      type: {
        ar: c.type?.ar || badge || 'شهادة',
        en: c.type?.en || badge || 'Certificate',
      },
      badge,
      description: {
        ar: c.description_ar || c.description?.ar || c.description_en || c.description?.en || '',
        en: c.description_en || c.description?.en || c.description_ar || c.description?.ar || '',
      },
      issuer,
      date,
      platform: issuer,
      year: date,
      link: c.link || '',
      image: c.image || '',
      icon: c.icon || '🏅',
      color: c.color || '#00E5FF',
    };
  });
}

export function cmsTestimonials(cmsData, fallbackTestimonials, fallbackRecommendation) {
  const testimonials = cmsData?.reviews?.length
    ? cmsData.reviews.map((r) => ({
        id: r.id,
        name: r.name || '',
        platform: r.platform || '',
        service: { ar: r.service_ar || r.service_en || '', en: r.service_en || r.service_ar || '' },
        quote: { ar: r.comment_ar || r.comment_en || '', en: r.comment_en || r.comment_ar || '' },
        rating: Number(r.rating || 5),
        link: r.link || '',
        avatar: r.avatar || '',
      }))
    : fallbackTestimonials;

  const src = cmsData?.recommendations?.[0];
  const recommendation = src
    ? {
        name: { ar: src.name_ar || src.name || '', en: src.name || src.name_ar || '' },
        title: { ar: src.title_ar || '', en: src.title_en || '' },
        institution: { ar: src.institution_ar || '', en: src.institution_en || '' },
        quote: { ar: src.quote_ar || '', en: src.quote_en || '' },
        linkedin: src.linkedin || '',
        avatar: src.avatar || '',
      }
    : fallbackRecommendation;

  return { testimonials, recommendation };
}

export function cmsExperience(cmsData, lang, fallback) {
  if (!cmsData?.experience?.length) return fallback;

  return cmsData.experience.map((e) => ({
    role: localized(e, 'role', lang),
    company: localized(e, 'company', lang),
    period: localized(e, 'period', lang),
    type: e.type || 'work',
    bullets: String(localized(e, 'bullets', lang)).split('\n').filter(Boolean),
    color: e.color || '#00E5FF',
  }));
}

export function cmsSkills(cmsData, fallbackGroups, lang) {
  if (!cmsData?.skills?.length) return fallbackGroups;

  const iconMap = {
    'Programming & Data Tools': 'Code2',
    'Data Analysis & Visualization': 'BarChart3',
    'Business Intelligence': 'BarChart3',
    'Machine Learning': 'BrainCircuit',
    'Deep Learning & Computer Vision': 'BrainCircuit',
    'Databases & Data Modeling': 'Database',
    'Business Analytics': 'BarChart3',
    'Application Development': 'Code2',
    'Leadership & Project Management': 'Code2',
    'Soft Skills': 'Code2',
    ML: 'BrainCircuit',
    'Data Eng': 'Database',
    Analytics: 'BarChart3',
    Dev: 'Code2',
    CV: 'BrainCircuit',
    NLP: 'BrainCircuit',
    Other: 'Code2',
  };

  const colorMap = {
    'Programming & Data Tools': '#00E5FF',
    'Data Analysis & Visualization': '#22C55E',
    'Business Intelligence': '#8B5CF6',
    'Machine Learning': '#F59E0B',
    'Deep Learning & Computer Vision': '#EC4899',
    'Databases & Data Modeling': '#06B6D4',
    'Business Analytics': '#10B981',
    'Application Development': '#6366F1',
    'Leadership & Project Management': '#F97316',
    'Soft Skills': '#A855F7',
    ML: '#F59E0B',
    'Data Eng': '#06B6D4',
    Analytics: '#22C55E',
    Dev: '#6366F1',
    CV: '#EC4899',
    NLP: '#F59E0B',
    Other: '#00E5FF',
  };

  const legacyLabels = {
    ML: { en: 'Machine Learning', ar: 'تعلم الآلة' },
    'Data Eng': { en: 'Databases & Data Modeling', ar: 'قواعد البيانات ونمذجة البيانات' },
    Analytics: { en: 'Data Analysis & Visualization', ar: 'تحليل البيانات والتصور البياني' },
    Dev: { en: 'Application Development', ar: 'تطوير التطبيقات' },
    CV: { en: 'Deep Learning & Computer Vision', ar: 'التعلم العميق ورؤية الحاسوب' },
    NLP: { en: 'Machine Learning', ar: 'تعلم الآلة' },
    Other: { en: 'Programming & Data Tools', ar: 'البرمجة وأدوات البيانات' },
  };

  // New grouped schema: { category_en, category_ar, skills: [] }
  if (cmsData.skills.some((skill) => Array.isArray(skill?.skills))) {
    return cmsData.skills.map((group, index) => {
      const label = lang === 'ar'
        ? (group.category_ar || group.category_en || `مجموعة ${index + 1}`)
        : (group.category_en || group.category_ar || `Skill Group ${index + 1}`);
      const iconKey = group.iconKey || iconMap[group.category_en] || iconMap[group.category] || 'Code2';
      return {
        category: group.category_en || group.category || label,
        iconKey,
        label,
        color: group.color || colorMap[group.category_en] || '#00E5FF',
        skills: Array.isArray(group.skills) ? group.skills.filter(Boolean) : [],
      };
    });
  }

  // Backward compatibility for old flat schema.
  const groups = [];
  cmsData.skills.forEach((skill) => {
    const cat = skill.category || 'Other';
    const labelEn = legacyLabels[cat]?.en || cat;
    let group = groups.find((g) => g.category === labelEn);
    if (!group) {
      group = {
        category: labelEn,
        iconKey: iconMap[cat] || 'Code2',
        label: legacyLabels[cat]?.[lang] || cat,
        color: colorMap[cat] || '#00E5FF',
        skills: [],
      };
      groups.push(group);
    }
    const name = skill[`name_${lang}`] || skill.name_en || skill.name_ar || '';
    if (name && !group.skills.some(s => s.toLowerCase() === String(name).toLowerCase())) group.skills.push(name);
  });

  return groups;
}
