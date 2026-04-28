import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const CmsContext = createContext({ data: null, loading: true });
export function CmsProvider({ children }) {
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{let off=false; fetch(`${API_URL}/api/content`).then(r=>r.ok?r.json():Promise.reject()).then(j=>{if(!off&&j&&j.about)setData(j);}).catch(()=>{}).finally(()=>!off&&setLoading(false)); return()=>{off=true};},[]);
  const value=useMemo(()=>({data,loading}),[data,loading]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}
export function useCms(){return useContext(CmsContext);}
export function localized(item, field, lang){return item?.[`${field}_${lang}`] ?? item?.[field]?.[lang] ?? item?.[field] ?? '';}
export function cmsProjects(cmsData,fallback){
  if(!cmsData?.projects)return fallback;
  return cmsData.projects.map(p=>({
    id:p.id,
    title:{ar:p.title_ar||p.title_en||'',en:p.title_en||p.title_ar||''},
    description:{ar:p.description_ar||p.description_en||'',en:p.description_en||p.description_ar||''},
    shortDesc:{ar:p.description_ar||p.description_en||'',en:p.description_en||p.description_ar||''},
    tech:Array.isArray(p.tech)?p.tech:String(p.tech||'').split(',').map(x=>x.trim()).filter(Boolean),
    github:p.github||'', live:p.live||null,
    category:p.category||'Machine Learning', categoryAr:p.category_ar||p.categoryAr||p.category||'',
    color:p.color||'#00E5FF', images:Array.isArray(p.images)?p.images:[]
  }));
}
export function cmsCertificates(cmsData,fallback){
  if(!cmsData?.certificates)return fallback;
  return cmsData.certificates.map(c=>({id:c.id,title:{ar:c.title_ar||c.title_en||'',en:c.title_en||c.title_ar||''},type:{ar:c.badge||'شهادة',en:c.badge||'Certificate'},description:{ar:c.issuer||'',en:c.issuer||''},issuer:c.issuer||'',date:c.date||'',link:c.link||'',image:c.image||'',color:c.color||'#00E5FF'}));
}
export function cmsTestimonials(cmsData,ft,fr){
  const testimonials=cmsData?.reviews?cmsData.reviews.map(r=>({id:r.id,name:r.name||'',platform:r.platform||'',service:{ar:r.service_ar||r.service_en||'',en:r.service_en||r.service_ar||''},quote:{ar:r.comment_ar||r.comment_en||'',en:r.comment_en||r.comment_ar||''},rating:Number(r.rating||5),link:r.link||'',avatar:r.avatar||''})):ft;
  const src=cmsData?.recommendations?.[0];
  const recommendation=src?{name:{ar:src.name_ar||src.name||'',en:src.name||src.name_ar||''},title:{ar:src.title_ar||'',en:src.title_en||''},institution:{ar:src.institution_ar||'',en:src.institution_en||''},quote:{ar:src.quote_ar||'',en:src.quote_en||''},linkedin:src.linkedin||'',avatar:src.avatar||''}:fr;
  return {testimonials,recommendation};
}
export function cmsExperience(cmsData,lang,fallback){
  if(!cmsData?.experience)return fallback;
  return cmsData.experience.map(e=>({role:localized(e,'role',lang),company:localized(e,'company',lang),period:localized(e,'period',lang),type:e.type||'work',bullets:String(localized(e,'bullets',lang)).split('\n').filter(Boolean),color:e.color||'#00E5FF'}));
}
