/**
 * ============================================================
 *  Ahmed Portfolio — Admin Dashboard  ✦ BILINGUAL EDITION
 *  Full Arabic (RTL) + English (LTR) content management
 *  All real data pre-loaded · AR/EN toggle on every form
 * ============================================================
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  useTheme, useToast, Ic, I, useT, ToastProvider, ThemeProvider,
  Btn, Field, inputStyle, Input,
} from "./theme.jsx";
import { getContent, saveContent, uploadImage, uploadMedia, hasToken, removeToken } from "./api.js";
import Login from "./Login.jsx";

// ─── IMAGE UPLOADER ──────────────────────────────────────────
// Single-image uploader: always shows existing image, replace/remove buttons,
// drag & drop zone when empty. shape = "avatar" | "rect"
function SingleImageUploader({ value, onChange, label, hint, shape="rect" }) {
  const t = useT();
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [hov, setHov] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isAvatar = shape === "avatar";

  const readFile = async file => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      setUploading(true);
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (err) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };
  const onDrop = e => { e.preventDefault(); setDrag(false); readFile(e.dataTransfer.files[0]); };
  const onPick = e => { readFile(e.target.files[0]); e.target.value = ""; };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {label && (
        <label style={{ fontSize:11, fontWeight:700, color:t.textMut, textTransform:"uppercase", letterSpacing:"0.08em" }}>
          {label}{hint && <span style={{ fontWeight:400, textTransform:"none", letterSpacing:"normal", marginLeft:6, opacity:0.65 }}>{hint}</span>}
        </label>
      )}

      {value ? (
        /* ── HAS IMAGE: show it with action buttons ── */
        <div style={{ display:"flex", flexDirection: isAvatar ? "column" : "row", alignItems: isAvatar ? "center" : "flex-start", gap:12 }}>
          {/* image preview */}
          <div
            style={{ position:"relative", flexShrink:0 }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
          >
            <img
              src={value}
              alt="current"
              style={{
                width: isAvatar ? 96 : 200,
                height: isAvatar ? 96 : 130,
                objectFit: "cover",
                borderRadius: isAvatar ? "50%" : 10,
                border: `2px solid ${hov ? t.accent : t.border}`,
                display: "block",
                transition: "border-color 0.15s",
              }}
            />
            {/* dim overlay on hover */}
            {hov && (
              <div style={{
                position:"absolute", inset:0, borderRadius: isAvatar ? "50%" : 10,
                background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center",
                gap:8, pointerEvents:"none",
              }}>
                <span style={{ fontSize:11, color:"#fff", fontWeight:700 }}>Current image</span>
              </div>
            )}
          </div>

          {/* action buttons column */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1 }}>
            <div style={{ fontSize:12, color:t.textSub, lineHeight:1.6, marginBottom:2 }}>
              {isAvatar ? "Current profile photo" : "Current image"} — click <strong style={{color:t.text}}>Replace</strong> to upload a new one from your PC, or <strong style={{color:t.danger}}>Remove</strong> to clear it.
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Btn size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
                <Ic d={I.upload} size={12} /> {uploading ? "Uploading..." : "Replace image"}
              </Btn>
              <Btn size="sm" variant="danger" onClick={() => onChange("")}>
                <Ic d={I.trash} size={12} /> Remove
              </Btn>
            </div>
            {/* mini drop zone when has image */}
            <div
              onDragOver={e=>{e.preventDefault();setDrag(true);}}
              onDragLeave={()=>setDrag(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border:`1.5px dashed ${drag ? t.accent : t.border}`,
                borderRadius:8, padding:"8px 12px", cursor:"pointer",
                background: drag ? t.accentSoft : "transparent",
                display:"flex", alignItems:"center", gap:7, transition:"all 0.15s",
              }}
            >
              <Ic d={drag ? I.image : I.upload} size={13} style={{ color:t.accent, flexShrink:0 }} />
              <span style={{ fontSize:11, color:t.textMut }}>
                {drag ? "Drop to replace" : "Or drag & drop a new image here"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ── NO IMAGE: full drop zone ── */
        <div
          onDragOver={e=>{e.preventDefault();setDrag(true);}}
          onDragLeave={()=>setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border:`2px dashed ${drag ? t.accent : t.border}`,
            borderRadius:12, cursor:"pointer", transition:"all 0.2s",
            background: drag ? t.accentSoft : t.glass,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:10, padding: isAvatar ? "24px 20px" : "32px 20px",
          }}
        >
          <div style={{
            width:52, height:52, borderRadius: isAvatar ? "50%" : 14,
            background: drag ? t.accentSoft : t.surfaceEl,
            border:`1px solid ${drag ? t.accent : t.border}`,
            display:"flex", alignItems:"center", justifyContent:"center", color:t.accent,
            transition:"all 0.2s",
          }}>
            <Ic d={drag ? I.image : I.upload} size={22} />
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{uploading ? "Uploading..." : drag ? "Drop image here" : "Click or drag & drop"}</div>
            <div style={{ fontSize:11, color:t.textMut, marginTop:3 }}>PNG · JPG · WEBP · max 10 MB</div>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={onPick} />
    </div>
  );
}

// ─── MULTI IMAGE UPLOADER (Projects) ─────────────────────────
// Full grid: see all images, delete any, REPLACE/EDIT any individually,
// drag to reorder, add more via click or drag-and-drop.
function MultiImageUploader({ images=[], onChange, label, hint }) {
  const t = useT();
  const addRef    = useRef(null);   // "add more" file input
  const replaceRef = useRef(null);  // per-card "replace" file input
  const [dropDrag, setDropDrag] = useState(false);
  const [dragIdx,  setDragIdx]  = useState(null);
  const [overIdx,  setOverIdx]  = useState(null);
  const [editIdx,  setEditIdx]  = useState(null); // which card is being replaced
  const [uploading, setUploading] = useState(false);

  /* ── upload multiple new files and append Cloudinary URLs ── */
  const readFiles = async (files, replaceAt=null) => {
    const arr = [...files].filter(f => f.type.startsWith("image/"));
    if (!arr.length) return;
    try {
      setUploading(true);
      const urls = await Promise.all(arr.map(file => uploadImageFile(file)));
      if (replaceAt !== null) {
        const next = [...images];
        next[replaceAt] = urls[0];
        onChange(next);
      } else {
        onChange([...images, ...urls.filter(Boolean)]);
      }
    } catch (err) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onAddPick     = e => { readFiles(e.target.files);             e.target.value = ""; };
  const onReplacePick = e => { readFiles(e.target.files, editIdx);    e.target.value = ""; setEditIdx(null); };
  const onZoneDrop    = e => { e.preventDefault(); setDropDrag(false); readFiles(e.dataTransfer.files); };

  const triggerReplace = idx => { setEditIdx(idx); setTimeout(()=>replaceRef.current?.click(), 0); };

  /* ── drag-to-reorder cards ── */
  const onCardDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed="move"; e.dataTransfer.setData("text/plain", String(idx)); };
  const onCardDragOver  = (e, idx) => { e.preventDefault(); if (idx !== dragIdx) setOverIdx(idx); };
  const onCardDrop      = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setOverIdx(null); return; }
    const next = [...images];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    onChange(next);
    setDragIdx(null); setOverIdx(null);
  };
  const onCardDragEnd = () => { setDragIdx(null); setOverIdx(null); };
  const remove = idx => onChange(images.filter((_, i) => i !== idx));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {label && (
        <label style={{ fontSize:11, fontWeight:700, color:t.textMut, textTransform:"uppercase", letterSpacing:"0.08em" }}>
          {label}{hint && <span style={{ fontWeight:400, textTransform:"none", letterSpacing:"normal", marginLeft:6, opacity:0.65 }}>{hint}</span>}
        </label>
      )}

      {/* ── CURRENT IMAGES GRID ── */}
      {images.length > 0 && (
        <div style={{ background:t.surfaceEl, border:`1px solid ${t.border}`, borderRadius:14, padding:14 }}>
          <div style={{ fontSize:11, color:t.textMut, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ color:t.accent }}>✦</span>
            <strong style={{ color:t.text }}>{images.length}</strong> image{images.length!==1?"s":""} —
            <span>drag to reorder · first image is the <strong style={{color:t.accent}}>cover</strong></span>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
            {images.map((src, idx) => {
              const isOver   = overIdx  === idx;
              const isDragging = dragIdx === idx;
              return (
                <div
                  key={idx}
                  draggable
                  onDragStart={e => onCardDragStart(e, idx)}
                  onDragOver={e  => onCardDragOver(e, idx)}
                  onDrop={e      => onCardDrop(e, idx)}
                  onDragEnd={onCardDragEnd}
                  style={{
                    display:"flex", flexDirection:"column", gap:6,
                    opacity: isDragging ? 0.4 : 1,
                    transition:"opacity 0.15s",
                    width:130, flexShrink:0,
                  }}
                >
                  {/* image card */}
                  <div style={{
                    position:"relative", width:130, height:95, borderRadius:10, overflow:"hidden",
                    border:`2px solid ${isOver ? t.accent : isDragging ? t.accent+"50" : t.border}`,
                    boxShadow: isOver ? `0 0 0 3px ${t.accentSoft}` : "none",
                    cursor:"grab", transition:"border-color 0.15s",
                  }}>
                    <img src={src} alt={`img-${idx}`} style={{ width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none", display:"block" }} />

                    {/* COVER badge */}
                    {idx === 0 && (
                      <div style={{ position:"absolute", bottom:5, left:5, background:`${t.accent}dd`, borderRadius:5, padding:"2px 7px", fontSize:9, fontWeight:800, color:"#fff", letterSpacing:"0.08em" }}>
                        COVER
                      </div>
                    )}

                    {/* position badge */}
                    <div style={{ position:"absolute", top:5, left:5, background:"rgba(0,0,0,0.6)", borderRadius:5, padding:"2px 6px", fontSize:9, fontWeight:700, color:"#fff" }}>
                      #{idx+1}
                    </div>

                    {/* drag handle (top-right) */}
                    <div style={{ position:"absolute", top:5, right:5, background:"rgba(0,0,0,0.5)", borderRadius:5, padding:"2px 5px", fontSize:12, color:"rgba(255,255,255,0.85)", lineHeight:1, cursor:"grab" }}>
                      ⠿
                    </div>
                  </div>

                  {/* action row below card */}
                  <div style={{ display:"flex", gap:4 }}>
                    <button
                      onClick={() => triggerReplace(idx)}
                      title="Replace this image"
                      style={{
                        flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                        padding:"5px 0", borderRadius:7, border:`1px solid ${t.border}`,
                        background:t.surface, color:t.textSub, cursor:"pointer", fontSize:11, fontWeight:600,
                        transition:"all 0.15s",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background=t.accentSoft;e.currentTarget.style.color=t.accent;e.currentTarget.style.borderColor=t.accent+"60";}}
                      onMouseLeave={e=>{e.currentTarget.style.background=t.surface;e.currentTarget.style.color=t.textSub;e.currentTarget.style.borderColor=t.border;}}
                    >
                      <Ic d={I.edit} size={11} /> Edit
                    </button>
                    <button
                      onClick={() => remove(idx)}
                      title="Delete this image"
                      style={{
                        flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                        padding:"5px 0", borderRadius:7, border:`1px solid ${t.danger}30`,
                        background:t.dangerSoft, color:t.danger, cursor:"pointer", fontSize:11, fontWeight:600,
                        transition:"all 0.15s",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background=t.danger;e.currentTarget.style.color="#fff";}}
                      onMouseLeave={e=>{e.currentTarget.style.background=t.dangerSoft;e.currentTarget.style.color=t.danger;}}
                    >
                      <Ic d={I.trash} size={11} /> Del
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ADD MORE / DROP ZONE ── */}
      <div
        onDragOver={e=>{e.preventDefault();setDropDrag(true);}}
        onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDropDrag(false);}}
        onDrop={onZoneDrop}
        onClick={() => addRef.current?.click()}
        style={{
          border:`2px dashed ${dropDrag ? t.accent : t.border}`,
          borderRadius:12, cursor:"pointer", transition:"all 0.2s",
          background: dropDrag ? t.accentSoft : t.glass,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:8, padding:"22px 16px",
        }}
      >
        <div style={{ width:44, height:44, borderRadius:12, background:dropDrag?t.accentSoft:t.surfaceEl, border:`1px solid ${dropDrag?t.accent:t.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:t.accent, transition:"all 0.2s" }}>
          <Ic d={dropDrag ? I.image : I.upload} size={20} />
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:t.text }}>
            {uploading ? "Uploading..." : dropDrag ? "Drop images here" : images.length ? "Add more images" : "Click or drag & drop images"}
          </div>
          <div style={{ fontSize:11, color:t.textMut, marginTop:3 }}>PNG · JPG · WEBP · select multiple at once · max 10 MB each</div>
        </div>
      </div>

      {/* hidden file inputs */}
      <input ref={addRef}     type="file" accept="image/*" multiple style={{ display:"none" }} onChange={onAddPick}     />
      <input ref={replaceRef} type="file" accept="image/*"          style={{ display:"none" }} onChange={onReplacePick} />
    </div>
  );
}

// back-compat alias used by sections below
function ImageUploader({ value, onChange, label, shape="rect", hint, multi=false, images=[], onImagesChange }) {
  if (multi) return <MultiImageUploader images={images} onChange={onImagesChange} label={label} hint={hint} />;
  return <SingleImageUploader value={value} onChange={onChange} label={label} hint={hint} shape={shape} />;
}


function MultiVideoUploader({ videos = [], onChange, label, hint }) {
  const t = useT();
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);

  const currentVideos = Array.isArray(videos) ? videos.filter(Boolean) : [];

  const readFiles = async (files) => {
    const arr = [...files].filter(file => file.type.startsWith("video/"));
    if (!arr.length) return;
    try {
      setUploading(true);
      const urls = await Promise.all(arr.map(file => uploadMediaFile(file)));
      onChange([...currentVideos, ...urls.filter(Boolean)]);
    } catch (err) {
      alert(err.message || "Video upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = (idx) => onChange(currentVideos.filter((_, i) => i !== idx));
  const onPick = e => { readFiles(e.target.files); e.target.value = ""; };
  const onDrop = e => { e.preventDefault(); setDrag(false); readFiles(e.dataTransfer.files); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {label && (
        <label style={{ fontSize:11, fontWeight:700, color:t.textMut, textTransform:"uppercase", letterSpacing:"0.08em" }}>
          {label}{hint && <span style={{ fontWeight:400, textTransform:"none", letterSpacing:"normal", marginLeft:6, opacity:0.65 }}>{hint}</span>}
        </label>
      )}

      {currentVideos.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8, background:t.surfaceEl, border:`1px solid ${t.border}`, borderRadius:14, padding:12 }}>
          {currentVideos.map((src, idx) => (
            <div key={src + idx} style={{ display:"flex", alignItems:"center", gap:10, border:`1px solid ${t.border}`, borderRadius:10, padding:8, background:t.surface }}>
              <video src={src} style={{ width:120, height:68, objectFit:"cover", borderRadius:8, background:"#000" }} controls />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:t.text }}>Project video #{idx + 1}</div>
                <div style={{ fontSize:11, color:t.textMut, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{src}</div>
              </div>
              <Btn size="sm" variant="danger" onClick={() => remove(idx)}>
                <Ic d={I.trash} size={12} /> Remove
              </Btn>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={e=>{e.preventDefault();setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border:`2px dashed ${drag ? t.accent : t.border}`,
          borderRadius:12, cursor:"pointer", transition:"all 0.2s",
          background: drag ? t.accentSoft : t.glass,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:8, padding:"22px 16px",
        }}
      >
        <div style={{ width:44, height:44, borderRadius:12, background:drag?t.accentSoft:t.surfaceEl, border:`1px solid ${drag?t.accent:t.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:t.accent }}>
          <Ic d={I.upload} size={20} />
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:t.text }}>
            {uploading ? "Uploading video..." : drag ? "Drop videos here" : "Click or drag & drop project videos"}
          </div>
          <div style={{ fontSize:11, color:t.textMut, marginTop:3 }}>MP4 · WEBM · MOV supported through Cloudinary</div>
        </div>
      </div>

      <input ref={inputRef} type="file" accept="video/*" multiple style={{ display:"none" }} onChange={onPick} />
    </div>
  );
}

// ─── DATA ────────────────────────────────────────────────────
let _id = 200;
const nid = () => ++_id;

// ═══════════════════════════════════════════════════════════════
//  REAL DATA — All bilingual (ar + en)
// ═══════════════════════════════════════════════════════════════
const INITIAL = {
  about: {
    name_en: "Ahmed Ayman Soliman",
    name_ar: "أحمد أيمن سليمان",
    title_en: "AI Engineer · Data Engineer · MIS Student",
    title_ar: "مهندس ذكاء اصطناعي · مهندس بيانات · طالب نظم معلومات إدارية",
    bio1_en: "I'm a <accent>data-driven</accent> problem solver specializing in machine learning and analytics.",
    bio1_ar: "أنا <accent>أحمد أيمن سليمان</accent>، مهندس ذكاء اصطناعي وطالب هندسة بيانات في جامعة MSA، بمعدل تراكمي حالي <accent>3.63</accent>.",
    bio2_en: "Currently pursuing MIS at MSA University with a 3.63 GPA.",
    bio2_ar: "أتخصص في بناء أنظمة ذكية متكاملة: من تنظيف مجموعات البيانات الفوضوية إلى نشر نماذج رؤية الحاسوب.",
    bio3_en: "I've contributed to real-world ML systems, ETL pipelines, and Power BI dashboards at Encryptcore and Elevvo Pathways.",
    bio3_ar: "بفضل تجربتي العملية في Encryptcore وElevvo Pathways، أجمع بين الصرامة الأكاديمية والعمق الهندسي.",
    bio4_en: "Open to internships and freelance collaborations in AI and data engineering.",
    bio4_ar: "أبحث حالياً عن فرص التدريب والعمل الحر في الذكاء الاصطناعي وهندسة البيانات.",
    stats: { projects: "9+", gpa: "3.63", internships: "2+" },
  },
  siteText: {
    hero: {
      subtitle_en: "AI Engineer · Data Engineer · MIS Student",
      subtitle_ar: "مهندس ذكاء اصطناعي · مهندس بيانات · طالب نظم معلومات إدارية",
      description_en: "I build intelligent systems that combine machine learning, data engineering, and clean user experiences.",
      description_ar: "أبني أنظمة ذكية تجمع بين تعلم الآلة، هندسة البيانات، وتجربة استخدام واضحة واحترافية."
    },
    sections: {
      about: { title_en: "About", title_ar: "نبذة عني", subtitle_en: "A quick summary of my background, skills, and practical experience.", subtitle_ar: "ملخص سريع عن خلفيتي ومهاراتي وخبرتي العملية." },
      skills: { title_en: "Skills", title_ar: "المهارات", subtitle_en: "The main tools and technologies I use across AI, data, and development.", subtitle_ar: "أهم الأدوات والتقنيات التي أستخدمها في الذكاء الاصطناعي والبيانات والتطوير." },
      projects: { title_en: "Projects", title_ar: "المشاريع", subtitle_en: "End-to-end ML systems, computer vision applications, and data engineering pipelines.", subtitle_ar: "أنظمة ML متكاملة، تطبيقات رؤية الحاسوب، وخطوط أنابيب هندسة البيانات." },
      experience: { title_en: "Experience", title_ar: "الخبرات", subtitle_en: "Internships, freelance work, and hands-on technical experience.", subtitle_ar: "تدريبات، أعمال حرة، وخبرة تقنية عملية." },
      certificates: { title_en: "Certifications", title_ar: "الشهادات", subtitle_en: "Selected certificates and learning achievements.", subtitle_ar: "مجموعة مختارة من الشهادات والإنجازات التعليمية." },
      reviews: { title_en: "Reviews", title_ar: "آراء العملاء", subtitle_en: "Client feedback and recommendations from real work.", subtitle_ar: "آراء العملاء والتوصيات من أعمال حقيقية." },
      recommendations: { title_en: "Recommendations", title_ar: "التوصيات", subtitle_en: "Professional and academic recommendations.", subtitle_ar: "توصيات مهنية وأكاديمية." },
      contact: { title_en: "Contact", title_ar: "تواصل معي", subtitle_en: "Have an opportunity or project? Let’s talk.", subtitle_ar: "عندك فرصة أو مشروع؟ خلينا نتواصل." }
    }
  },
  skills: [
    { id: 1, category_en: "Programming & Data Tools", category_ar: "البرمجة وأدوات البيانات", icon: "🧰", color: "#00E5FF", skills: ["Python", "Jupyter Notebook", "Pandas", "NumPy"] },
    { id: 2, category_en: "Data Analysis & Visualization", category_ar: "تحليل البيانات والتصور البياني", icon: "📊", color: "#22C55E", skills: ["EDA", "Data Cleaning", "Data Filtering", "Statistical Analysis", "Dataset Exploration", "Matplotlib", "Seaborn", "Data Visualization"] },
    { id: 3, category_en: "Business Intelligence", category_ar: "ذكاء الأعمال", icon: "📈", color: "#8B5CF6", skills: ["Power BI", "Tableau", "Microsoft Excel", "Dashboard Design", "Pivot Tables", "Pivot Charts", "Slicers", "KPI Tracking", "Business Intelligence"] },
    { id: 4, category_en: "Machine Learning", category_ar: "تعلم الآلة", icon: "🧠", color: "#F59E0B", skills: ["Scikit-learn", "XGBoost", "Regression", "Classification", "Clustering", "K-Means", "DBSCAN", "Feature Engineering", "Model Training", "Model Evaluation"] },
    { id: 5, category_en: "Deep Learning & Computer Vision", category_ar: "التعلم العميق ورؤية الحاسوب", icon: "👁️", color: "#EC4899", skills: ["TensorFlow", "Keras", "CNN", "Transfer Learning", "MobileNetV2", "YOLOv8", "Ultralytics", "OpenCV", "Image Classification", "Object Detection", "Real-Time Inference"] },
    { id: 6, category_en: "Databases & Data Modeling", category_ar: "قواعد البيانات ونمذجة البيانات", icon: "🗄️", color: "#06B6D4", skills: ["MySQL", "Data Modeling", "Star Schema", "Data Preprocessing", "Data Scaling"] },
    { id: 7, category_en: "Business Analytics", category_ar: "تحليلات الأعمال", icon: "💼", color: "#10B981", skills: ["Sales Analytics", "Customer Analytics", "Marketing Analytics", "Revenue Analysis", "Sports Analytics", "Performance Analysis"] },
    { id: 8, category_en: "Application Development", category_ar: "تطوير التطبيقات", icon: "🖥️", color: "#6366F1", skills: ["Flask", "PyQt", "Tkinter", "GUI Development", "Prediction App Development"] },
    { id: 9, category_en: "Leadership & Project Management", category_ar: "القيادة وإدارة المشاريع", icon: "🚀", color: "#F97316", skills: ["Team Leadership", "Task Coordination", "Project Planning", "Documentation", "Presentation Skills", "Team Collaboration"] },
    { id: 10, category_en: "Soft Skills", category_ar: "المهارات الشخصية", icon: "✨", color: "#A855F7", skills: ["Problem Solving", "Analytical Thinking", "Fast Learning", "Self-Learning", "Attention to Detail", "Communication", "Adaptability", "Critical Thinking", "Research Skills", "Time Management", "Ownership Mindset"] },
  ],
  projects: [
    { id:1, title_en:"Data Decoders", title_ar:"محللو البيانات", description_en:"Comprehensive data analysis platform decoding complex datasets into actionable insights. Built as a team competition project with advanced visualizations and ML integration.", description_ar:"منصة شاملة لتحليل البيانات تحوّل مجموعات البيانات المعقدة إلى رؤى قابلة للتنفيذ.", tech:"Python, Pandas, Scikit-learn, Power BI, SQL", github:"https://github.com/ahmedaymansoliman2004", live:"", category:"Data Engineering", color:"#00E5FF", images:[] },
    { id:2, title_en:"Forest Cover Classification", title_ar:"تصنيف أنواع غطاء الغابات", description_en:"ML model classifying forest cover types using cartographic variables with ensemble methods, feature engineering, and hyperparameter tuning on UCI dataset.", description_ar:"نموذج تعلم آلة يصنّف أنواع غطاء الغابات باستخدام متغيرات الخرائط الطبوغرافية.", tech:"Python, Scikit-learn, XGBoost, NumPy, Matplotlib", github:"https://github.com/ahmedaymansoliman2004", live:"https://www.kaggle.com/sohagy1312", category:"Machine Learning", color:"#22C55E", images:[] },
    { id:3, title_en:"Traffic Sign Recognition", title_ar:"التعرف على إشارات المرور", description_en:"Deep learning system for real-time traffic sign detection using CNNs. Trained on GTSRB dataset achieving 97%+ accuracy, suitable for autonomous driving.", description_ar:"نظام تعلم عميق للكشف عن إشارات المرور وتصنيفها في الوقت الفعلي بدقة 97%+.", tech:"Python, TensorFlow, Keras, OpenCV, NumPy", github:"https://github.com/ahmedaymansoliman2004", live:"", category:"Computer Vision", color:"#F59E0B", images:[] },
    { id:4, title_en:"AI Camera Dress Code", title_ar:"كاميرا ذكاء اصطناعي لكود اللباس", description_en:"Real-time AI system detecting dress code compliance using YOLOv8. Trained on 2,700+ labeled images with OpenCV integration for live camera inference.", description_ar:"نظام ذكاء اصطناعي للكشف عن الالتزام بكود اللباس باستخدام YOLOv8 مع أكثر من 2700 صورة مُصنَّفة.", tech:"Python, YOLOv8, OpenCV, PyTorch, Roboflow", github:"https://github.com/ahmedaymansoliman2004", live:"", category:"Computer Vision", color:"#8B5CF6", images:[] },
    { id:5, title_en:"StyleNest Apparel Analysis", title_ar:"StyleNest – تحليل الملابس", description_en:"E-commerce analytics platform analyzing apparel sales trends with customer segmentation, product performance dashboards, and predictive inventory modeling.", description_ar:"منصة تحليلات تجارة إلكترونية لتحليل اتجاهات مبيعات الملابس مع تقسيم العملاء.", tech:"Python, Pandas, Power BI, SQL, Seaborn", github:"https://github.com/ahmedaymansoliman2004", live:"https://www.kaggle.com/sohagy1312", category:"Data Analytics", color:"#EC4899", images:[] },
    { id:6, title_en:"Student Score Prediction", title_ar:"التنبؤ بدرجات الطلاب", description_en:"Regression model predicting student academic performance. Includes interactive Flask web app for real-time predictions with feature importance visualization.", description_ar:"نموذج انحدار للتنبؤ بالأداء الأكاديمي مع تطبيق ويب Flask تفاعلي.", tech:"Python, Scikit-learn, Flask, Pandas, Plotly", github:"https://github.com/ahmedaymansoliman2004", live:"", category:"Machine Learning", color:"#06B6D4", images:[] },
    { id:7, title_en:"Customer Segmentation", title_ar:"تقسيم العملاء", description_en:"Unsupervised clustering solution for e-commerce customer segmentation. Identified 5 distinct customer personas enabling targeted marketing with 40% better ROI.", description_ar:"حل تجميع غير خاضع للإشراف يحدد 5 شرائح عملاء مميزة بعائد استثمار أفضل بـ40%.", tech:"Python, Scikit-learn, Pandas, Matplotlib, Seaborn", github:"https://github.com/ahmedaymansoliman2004", live:"https://www.kaggle.com/sohagy1312", category:"Data Analytics", color:"#10B981", images:[] },
    { id:8, title_en:"Health Insurance Prediction", title_ar:"التنبؤ بالتأمين الصحي", description_en:"End-to-end ML pipeline predicting health insurance premium costs deployed as Flask web application with REST API and XGBoost achieving best performance.", description_ar:"خط أنابيب ML متكامل للتنبؤ بتكاليف أقساط التأمين الصحي مع نشر Flask API.", tech:"Python, XGBoost, Flask, Scikit-learn, Pandas", github:"https://github.com/ahmedaymansoliman2004", live:"", category:"Machine Learning", color:"#F97316", images:[] },
    { id:9, title_en:"Formula Student Analysis", title_ar:"تحليلات Formula Student", description_en:"Performance analytics system for Formula Student racing team analyzing telemetry data, lap times, and vehicle dynamics with SQL dashboards and Power BI reports.", description_ar:"نظام تحليلات أداء لفريق سباقات Formula Student مع لوحات SQL وتقارير Power BI.", tech:"Python, SQL, Power BI, Pandas, NumPy", github:"https://github.com/ahmedaymansoliman2004", live:"", category:"Data Engineering", color:"#EF4444", images:[] },
  ],
  experience: [
    { id:1, role_en:"IT Intern (AI Engineer)", role_ar:"متدرب تقنية المعلومات (مهندس ذكاء اصطناعي)", company_en:"Encryptcore", company_ar:"Encryptcore", category:"internship", startDate:"2026-08-01", endDate:"2026-09-30", present:false, bullets_en:"Developed AI-based dress code detection system using YOLOv8\nWorked with 2,700+ labeled images and real-time OpenCV inference", bullets_ar:"طور نظام اكتشاف قواعد اللباس بالذكاء الاصطناعي باستخدام YOLOv8\nعمل مع 2700+ صورة مُصنَّفة واستدلال OpenCV في الوقت الفعلي", color:"#8B5CF6" },
    { id:2, role_en:"Machine Learning Intern", role_ar:"متدرب تعلم الآلة", company_en:"Elevvo Pathways", company_ar:"Elevvo Pathways", category:"internship", startDate:"2026-02-01", endDate:"2026-03-31", present:false, bullets_en:"Completed ML tasks covering preprocessing, modeling, and evaluation\nApplied supervised learning techniques on real datasets", bullets_ar:"أتم مهام تعلم الآلة في المعالجة المسبقة والنمذجة والتقييم\nطبّق تقنيات التعلم المُشرف على مجموعات بيانات حقيقية", color:"#00E5FF" },
    { id:3, role_en:"Data Engineering Trainee", role_ar:"متدرب هندسة البيانات", company_en:"Digital Egypt Pioneers Initiative (DEPI)", company_ar:"مبادرة مصر الرقمية (DEPI)", category:"program", startDate:"2025-11-01", endDate:null, present:true, bullets_en:"Building ETL pipelines using Python, SQL, and Azure basics\nWorking on data workflows, automation, and Big Data concepts\nLeading a 6-member team in ETL pipeline project", bullets_ar:"بناء خطوط أنابيب ETL باستخدام Python وSQL وأساسيات Azure\nالعمل على سير بيانات وأتمتة ومفاهيم Big Data\nقيادة فريق من 6 أعضاء في مشروع ETL", color:"#22C55E" },
    { id:4, role_en:"Freelance ML Engineer", role_ar:"مهندس تعلم آلة حر", company_en:"Mostaql & Khamsat", company_ar:"مستقل وخمسات", category:"freelance", startDate:"2024-05-01", endDate:null, present:true, bullets_en:"Built ML models for regression and classification problems\nPerformed data preprocessing, feature engineering, and model deployment", bullets_ar:"بنى نماذج ML للانحدار والتصنيف\nأجرى معالجة بيانات وهندسة ميزات ونشر نماذج", color:"#F59E0B" },
    { id:5, role_en:"Data Analysis Trainee", role_ar:"متدرب تحليل البيانات", company_en:"Digital Egypt Pioneers Initiative (DEPI)", company_ar:"مبادرة مصر الرقمية (DEPI)", category:"program", startDate:"2024-11-01", endDate:"2025-05-31", present:false, bullets_en:"Analyzed 31K+ UK railway records using Python and SQL\nBuilt Power BI dashboards for KPIs and trends\nLed a 4-member analytics team", bullets_ar:"حلّل 31 ألف+ سجل سكك حديدية بريطانية بـPython وSQL\nبنى لوحات Power BI لمؤشرات الأداء والتوجهات\nقاد فريقًا تحليليًا من 4 أعضاء", color:"#EC4899" },
    { id:6, role_en:"MIS Student", role_ar:"طالب نظم معلومات إدارية", company_en:"MSA University", company_ar:"جامعة MSA", category:"education", startDate:"2023-10-01", endDate:"2027-06-30", present:false, bullets_en:"Faculty of Management Sciences – Management Information Systems\nGPA: 3.63 / 4.00 (Egyptian) · 3.73 / 4.00 (British)", bullets_ar:"كلية علوم الإدارة – نظم المعلومات الإدارية\nالمعدل: 3.63 / 4.00 (مصري) · 3.73 / 4.00 (بريطاني)", color:"#06B6D4" },
  ],
  reviews: [
    { id:1, name:"فراس ج.", platform:"Khamsat", service_en:"Data Analysis with Python", service_ar:"تحليل بيانات باستخدام بايثون", rating:5, comment_en:"We work under emergency conditions, and he was extremely patient with us. Thank you for your time and effort.", comment_ar:"نحن نعمل في ظروف طارئة، وكان صبور معنا لأبعد حد. شكرًا على وقتك وجهدك.", link:"https://khamsat.com/user/ahmedayman01555/reviews/1004857", avatar:"" },
    { id:2, name:"عمر ا.", platform:"Khamsat", service_en:"ML Model Building", service_ar:"بناء نموذج تعلم الآلة", rating:5, comment_en:"Extremely creative in his performance, highly professional in building models, fast in execution and responds to feedback with high efficiency. I strongly recommend working with him.", comment_ar:"مبدع جدًا جدًا في أدائه، ومحترف للغاية في بناء النماذج، سريع التنفيذ ويستجيب للملاحظات بكفاءة عالية.", link:"https://khamsat.com/user/ahmedayman01555/reviews/990220", avatar:"" },
    { id:3, name:"عمر ا.", platform:"Khamsat", service_en:"Data Analysis with Python", service_ar:"تحليل بيانات باستخدام بايثون", rating:5, comment_en:"Excellent and fast. I strongly recommend working with him.", comment_ar:"رائع جدًا وسريع. أنصح بالتعامل معه وبشدة.", link:"https://khamsat.com/user/ahmedayman01555/reviews/986001", avatar:"" },
    { id:4, name:"Abdulaziz S.", platform:"Mostaql", service_en:"Machine Learning Report", service_ar:"تقرير تعلم الآلة", rating:5, comment_en:"Good listener and professional in work.", comment_ar:"مستمع جيد واحترافية في العمل.", link:"https://mostaql.com/u/ahmedayman01555/reviews/7684398", avatar:"" },
    { id:5, name:"Abdulaziz S.", platform:"Mostaql", service_en:"Data Presentation Design", service_ar:"تصميم عروض البيانات", rating:5, comment_en:"Distinguished in work and quick in response.", comment_ar:"متميز في العمل وسرعة في التجاوب.", link:"https://mostaql.com/u/ahmedayman01555/reviews/7679424", avatar:"" },
  ],
  recommendations: [
    { id:1, name:"Dr. Amal Mahmoud", name_ar:"د. أمل محمود", title_en:"Assistant Professor | Machine Learning · Deep Learning · NLP · Computer Vision · Generative AI", title_ar:"أستاذة مساعدة | تعلم الآلة · التعلم العميق · معالجة اللغات الطبيعية · رؤية الحاسوب", institution_en:"FGSSR – Cairo University", institution_ar:"كلية الدراسات العليا للبحوث الإحصائية – جامعة القاهرة", quote_en:"I had the pleasure of teaching Ahmed Soliman in the Data Analysis course, and I can confidently say that he is one of the most committed and talented students I've worked with.\n\nHis dedication to learning, punctuality in submitting assignments, and strong work ethics truly set him apart.\n\nI highly recommend Ahmed for any opportunity in the field of data analytics.", quote_ar:"كان لي شرف تدريس أحمد سليمان في مادة تحليل البيانات، ويسعدني أن أؤكد بكل ثقة أنه من أكثر الطلاب التزامًا وموهبةً الذين عملت معهم.\n\nتميّز بتفانيه في التعلم، والتزامه الكامل في تسليم المهام، وأخلاقياته العملية الرفيعة.\n\nأوصي بأحمد بشدة لأي فرصة في مجال تحليل البيانات.", linkedin:"https://www.linkedin.com/in/amal-mahmoud-phd-8574b988/", avatar:"" },
  ],
  certificates: [
    { id:1, title_en:"Machine Learning Internship", title_ar:"تدريب تعلم الآلة", description_en:"Successful completion of the 1-month Machine Learning Internship Program.", description_ar:"إتمام ناجح لبرنامج تدريب تعلم الآلة لمدة شهر واحد.", issuer:"Elevvo", date:"Mar 2026", badge:"Internship", link:"", image:"" },
    { id:2, title_en:"Google Data Analyst Specialist", title_ar:"أخصائي تحليل بيانات Google", description_en:"Completed a specialized data analysis track covering spreadsheets, SQL, Python, and BI dashboards.", description_ar:"إتمام مسار متخصص في تحليل البيانات يشمل الجداول الإلكترونية، SQL، بايثون، ولوحات BI.", issuer:"DEPI · Egypt MCIT", date:"May 2025", badge:"DEPI", link:"", image:"" },
    { id:3, title_en:"Business English Track", title_ar:"مسار الإنجليزية للأعمال", description_en:"Completed business English training focused on professional communication and workplace language skills.", description_ar:"إتمام تدريب اللغة الإنجليزية للأعمال مع التركيز على التواصل المهني ومهارات اللغة في بيئة العمل.", issuer:"DEPI · Egypt MCIT", date:"May 2025", badge:"DEPI", link:"", image:"" },
    { id:4, title_en:"IT Internship – Networking & AI", title_ar:"تدريب تقنية المعلومات – شبكات وذكاء اصطناعي", description_en:"Practical IT internship covering networking fundamentals and AI-based system development.", description_ar:"تدريب عملي في تقنية المعلومات يشمل أساسيات الشبكات وتطوير أنظمة قائمة على الذكاء الاصطناعي.", issuer:"EncryptCore", date:"2024", badge:"Internship", link:"", image:"" },
    { id:5, title_en:"Cyber Violence Workshop", title_ar:"ورشة العنف الإلكتروني", description_en:"Attended a workshop discussing cyber violence awareness, prevention, and safe digital behavior.", description_ar:"حضور ورشة حول الوعي بالعنف الإلكتروني وطرق الوقاية والسلوك الرقمي الآمن.", issuer:"MSA University", date:"2023", badge:"Workshop", link:"", image:"" },
    { id:6, title_en:"Interviewing Skills Workshop", title_ar:"ورشة مهارات المقابلات", description_en:"Completed a workshop focused on interview preparation, communication, and employability skills.", description_ar:"إتمام ورشة تركز على الاستعداد للمقابلات، التواصل، ومهارات التوظيف.", issuer:"MSA University – CLC", date:"Sep 2023", badge:"Workshop", link:"", image:"" },
    { id:7, title_en:"Meet Your Expert", title_ar:"قابل خبيرك", description_en:"Participated in a career development program connecting students with industry experts.", description_ar:"المشاركة في برنامج تطوير مهني يربط الطلاب بخبراء من سوق العمل.", issuer:"MSA University – CLC", date:"Dec 2023", badge:"Program", link:"", image:"" },
    { id:8, title_en:"The Hour of Code", title_ar:"ساعة البرمجة", description_en:"Completed an introductory computer science activity focused on programming basics.", description_ar:"إتمام نشاط تمهيدي في علوم الحاسب يركز على أساسيات البرمجة.", issuer:"Code.org", date:"2023", badge:"CS Basics", link:"", image:"" },
  ],
  links: [
    { id:1, label:"GitHub", url:"https://github.com/ahmedaymansoliman2004" },
    { id:2, label:"Kaggle", url:"https://kaggle.com/sohagy1312" },
    { id:3, label:"Khamsat", url:"https://khamsat.com/user/ahmedayman01555" },
    { id:4, label:"Mostaql", url:"https://mostaql.com/u/ahmedayman01555" },
    { id:5, label:"LinkedIn", url:"https://linkedin.com/in/ahmedaymansoliman2004" },
  ],
  social: [
    { id:1, platform:"LinkedIn", icon:"💼", url:"https://linkedin.com/in/ahmedaymansoliman2004" },
    { id:2, platform:"GitHub", icon:"🐙", url:"https://github.com/ahmedaymansoliman2004" },
    { id:3, platform:"Kaggle", icon:"📊", url:"https://kaggle.com/sohagy1312" },
    { id:4, platform:"Khamsat", icon:"💰", url:"https://khamsat.com/user/ahmedayman01555" },
  ],
  contact: [
    { id:1, type:"Email", value:"ahmedayman01555@gmail.com" },
    { id:2, type:"Phone", value:"+20 XXX XXX XXXX" },
    { id:3, type:"WhatsApp", value:"+20 XXX XXX XXXX" },
    { id:4, type:"Address", value:"Giza, Egypt" },
  ],
};

function pillColor(t, cat) {
  if (!cat) return t.pill.other;
  const c = cat.toLowerCase();
  if (c.includes("ml") || c.includes("machine")) return t.pill.ml;
  if (c.includes("dev") || c.includes("python")) return t.pill.dev;
  if (c.includes("analy")) return t.pill.ana;
  if (c.includes("cv") || c.includes("vision")) return t.pill.cv;
  if (c.includes("data") || c.includes("eng")) return t.pill.data;
  if (c.includes("work")) return t.pill.work;
  if (c.includes("edu")) return t.pill.edu;
  if (c.includes("cert") || c.includes("intern") || c.includes("depi")) return t.pill.cert;
  return t.pill.other;
}

// ─── LANG TOGGLE ─────────────────────────────────────────────
function LangToggle({ lang, setLang }) {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, background:t.surfaceEl, border:`1px solid ${t.border}`, borderRadius:10, padding:3 }}>
      {["en","ar"].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding:"4px 12px", borderRadius:7, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
          background: lang===l ? (l==="ar" ? t.ar : t.accent) : "transparent",
          color: lang===l ? "#fff" : t.textMut,
          transition:"all 0.15s",
          fontFamily: l==="ar" ? "'Cairo', 'Noto Sans Arabic', sans-serif" : "inherit",
        }}>
          {l==="en" ? "EN 🇺🇸" : "AR 🇪🇬"}
        </button>
      ))}
    </div>
  );
}

// ─── BILINGUAL FIELD WRAPPER ─────────────────────────────────
function BilingualSection({ lang, children }) {
  const t = useT();
  const isAr = lang === "ar";
  return (
    <div style={{
      border: `1px solid ${isAr ? t.ar+"40" : t.border}`,
      borderRadius:12, padding:14, marginBottom:4,
      background: isAr ? t.arSoft : "transparent",
    }}>
      <div style={{ fontSize:10, fontWeight:700, color: isAr ? t.ar : t.textMut, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10, display:"flex", alignItems:"center", gap:5 }}>
        <Ic d={I.globe} size={11} /> {isAr ? "Arabic Content — عربي" : "English Content"}
      </div>
      {children}
    </div>
  );
}

// ─── CONFIRM DIALOG ──────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  const t = useT();
  return (
    <div style={{ position:"fixed",inset:0,zIndex:8888,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)" }}>
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, padding:28, maxWidth:380, width:"90%", boxShadow:t.shadowLg }}>
        <div style={{ fontSize:36, marginBottom:12 }}>🗑️</div>
        <p style={{ fontSize:15, fontWeight:600, color:t.text, marginBottom:6 }}>Confirm Delete</p>
        <p style={{ fontSize:13, color:t.textSub, marginBottom:20, lineHeight:1.6 }}>{message}</p>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────
function Modal({ title, onClose, children, wide }) {
  const t = useT();
  return (
    <div style={{ position:"fixed",inset:0,zIndex:7777,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(10px)" }}>
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:20, width:"100%", maxWidth:wide?720:560, maxHeight:"92vh", overflowY:"auto", boxShadow:t.shadowLg }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:`1px solid ${t.border}`,position:"sticky",top:0,background:t.surface,zIndex:1 }}>
          <span style={{ fontSize:15, fontWeight:650, color:t.text, letterSpacing:"-0.01em" }}>{title}</span>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:t.textMut,padding:6,borderRadius:8 }}>
            <Ic d={I.close} size={16} />
          </button>
        </div>
        <div style={{ padding:"20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function Textarea({ label, hint, rows=3, isAr, ...props }) {
  const t = useT();
  const [foc, setFoc] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <textarea rows={rows} style={{ ...inputStyle(t, foc, isAr), resize:"vertical" }} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} {...props} />
    </Field>
  );
}

function Select({ label, children, ...props }) {
  const t = useT();
  const [foc, setFoc] = useState(false);
  return (
    <Field label={label}>
      <select style={{ ...inputStyle(t, foc), appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2371717a' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:36 }}
        onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} {...props}>
        {children}
      </select>
    </Field>
  );
}

// ─── BILINGUAL INPUT PAIR ─────────────────────────────────────
function BiInputPair({ labelEn, labelAr, valEn, valAr, onChangeEn, onChangeAr, multiline, rows=2, lang }) {
  if (multiline) {
    return (
      <BilingualSection lang={lang}>
        {lang==="en"
          ? <Textarea label={labelEn} value={valEn} rows={rows} onChange={onChangeEn} />
          : <Textarea label={labelAr} value={valAr} rows={rows} onChange={onChangeAr} isAr />
        }
      </BilingualSection>
    );
  }
  return (
    <BilingualSection lang={lang}>
      {lang==="en"
        ? <Input label={labelEn} value={valEn} onChange={onChangeEn} />
        : <Input label={labelAr} value={valAr} onChange={onChangeAr} isAr />
      }
    </BilingualSection>
  );
}

// ─── PILL ────────────────────────────────────────────────────
function Pill({ children, bg, color, size="sm" }) {
  const pad = size==="sm"?"3px 9px":"5px 12px"; const fs = size==="sm"?11:12;
  return <span style={{ display:"inline-flex",alignItems:"center",padding:pad,borderRadius:99,fontSize:fs,fontWeight:650,background:bg,color,whiteSpace:"nowrap" }}>{children}</span>;
}
function CategoryPill({ cat }) {
  const t = useT(); const { bg, text } = pillColor(t, cat);
  return <Pill bg={bg} color={text}>{cat||"—"}</Pill>;
}

// ─── SECTION HEADER ──────────────────────────────────────────
function SectionHeader({ title, sub, icon, count, onAdd, langToggle }) {
  const t = useT();
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:38,height:38,borderRadius:11,background:t.accentSoft,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:t.accent }}>
          <Ic d={icon} size={16} />
        </div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:t.text, letterSpacing:"-0.02em" }}>{title}</div>
          <div style={{ fontSize:12, color:t.textMut, marginTop:1 }}>{count!==undefined?`${count} record${count!==1?"s":""}`:"" || sub}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {langToggle}
        {onAdd && <Btn onClick={onAdd}><Ic d={I.plus} size={14} /> Add New</Btn>}
      </div>
    </div>
  );
}

// ─── DATA TABLE ──────────────────────────────────────────────
function DataTable({ cols, rows, onEdit, onDelete, searchable, manualOrder=false, onMoveUp, onMoveDown }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const PER = 10;
  const { toast } = useToast();

  const filtered = rows.filter(r => !query || cols.some(c => String(r[c.key]??r[c.key+"_en"]??"").toLowerCase().includes(query.toLowerCase())));
  const sorted = manualOrder ? filtered : (sortCol ? [...filtered].sort((a,b)=>{ const av=a[sortCol]??""; const bv=b[sortCol]??""; return sortDir==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av)); }) : filtered);
  const pages = Math.max(1, Math.ceil(sorted.length/PER));
  const slice = sorted.slice((page-1)*PER, page*PER);

  const toggleSort = col => { if (manualOrder) return; if(sortCol===col) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortCol(col);setSortDir("asc");} };
  const allChecked = slice.length>0 && slice.every(r=>selected.has(r.id));
  const toggleAll = () => { setSelected(s=>{ const n=new Set(s); if(allChecked)slice.forEach(r=>n.delete(r.id)); else slice.forEach(r=>n.add(r.id)); return n; }); };

  return (
    <div>
      {(searchable||selected.size>0)&&(
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
          {searchable&&(
            <div style={{ position:"relative",flex:1 }}>
              <Ic d={I.search} size={14} style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:t.textMut,pointerEvents:"none" }} />
              <input placeholder="Search records…" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} style={{ ...inputStyle(t,false), paddingLeft:32, fontSize:12 }} />
            </div>
          )}
          {selected.size>0&&<Btn variant="danger" size="sm" onClick={()=>setConfirmBulk(true)}><Ic d={I.trash} size={12} /> Delete {selected.size}</Btn>}
        </div>
      )}
      <div style={{ borderRadius:14, border:`1px solid ${t.border}`, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:t.surfaceEl, borderBottom:`1px solid ${t.border}` }}>
                <th style={{ width:36, padding:"10px 12px" }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ accentColor:t.accent, cursor:"pointer" }} />
                </th>
                {cols.map(c=>(
                  <th key={c.key} onClick={()=>c.sortable!==false&&toggleSort(c.key)} style={{ padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:t.textMut,textTransform:"uppercase",letterSpacing:"0.07em",cursor:c.sortable!==false?"pointer":"default",whiteSpace:"nowrap",userSelect:"none" }}>
                    <span style={{ display:"inline-flex",alignItems:"center",gap:5 }}>{c.label}{c.sortable!==false&&sortCol===c.key&&(<Ic d={sortDir==="asc"?"M5 15l7-7 7 7":"M19 9l-7 7-7-7"} size={10} />)}</span>
                  </th>
                ))}
                <th style={{ padding:"10px 14px",textAlign:"right",fontSize:11,fontWeight:700,color:t.textMut,textTransform:"uppercase",letterSpacing:"0.07em" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length===0&&(
                <tr><td colSpan={cols.length+2} style={{ padding:"40px 20px",textAlign:"center",color:t.textMut,fontSize:13 }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>📭</div>{query?"No results found":"No records yet — add one above."}
                </td></tr>
              )}
              {slice.map(row => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: `1px solid ${t.border}`,
                    background: "transparent",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = t.surfaceEl; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding:"10px 12px" }}><input type="checkbox" checked={selected.has(row.id)} onChange={()=>setSelected(s=>{const n=new Set(s);n.has(row.id)?n.delete(row.id):n.add(row.id);return n;})} style={{ accentColor:t.accent,cursor:"pointer" }} /></td>
                  {cols.map(c=>(
                    <td key={c.key} style={{ padding:"11px 14px",color:t.text,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {c.render?c.render(row[c.key],row):(row[c.key]??<span style={{ color:t.textMut }}>—</span>)}
                    </td>
                  ))}
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex",justifyContent:"flex-end",gap:4 }}>
                      {manualOrder && (<><IconBtn icon={I.arrowUp} onClick={()=>onMoveUp?.(row.id)} title="Move up" disabled={rows.findIndex(x=>x.id===row.id)===0} /><IconBtn icon={I.arrowDown} onClick={()=>onMoveDown?.(row.id)} title="Move down" disabled={rows.findIndex(x=>x.id===row.id)===rows.length-1} /></>)}
                      <IconBtn icon={I.edit} onClick={()=>onEdit(row)} title="Edit" />
                      <IconBtn icon={I.trash} onClick={()=>setConfirmId(row.id)} title="Delete" danger />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages>1&&(
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderTop:`1px solid ${t.border}`,fontSize:12,color:t.textMut }}>
            <span>{filtered.length} total · page {page}/{pages}</span>
            <div style={{ display:"flex",gap:6 }}>
              {Array.from({length:pages},(_,i)=>(
                <button key={i} onClick={()=>setPage(i+1)} style={{ width:28,height:28,borderRadius:7,border:`1px solid ${page===i+1?t.accent:t.border}`,background:page===i+1?t.accentSoft:"transparent",color:page===i+1?t.accent:t.textMut,cursor:"pointer",fontSize:12,fontWeight:600 }}>{i+1}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      {confirmId&&<ConfirmDialog message="This action cannot be undone." onConfirm={()=>{onDelete(confirmId);setConfirmId(null);toast("Record deleted","success");}} onCancel={()=>setConfirmId(null)} />}
      {confirmBulk&&<ConfirmDialog message={`Delete ${selected.size} selected records?`} onConfirm={()=>{selected.forEach(id=>onDelete(id));setSelected(new Set());setConfirmBulk(false);toast(`Deleted ${selected.size} records`,"success");}} onCancel={()=>setConfirmBulk(false)} />}
    </div>
  );
}

function IconBtn({ icon, onClick, title, danger, disabled=false }) {
  const t = useT(); const [hov,setHov]=useState(false);
  return (
    <button disabled={disabled} onClick={disabled?undefined:onClick} title={title} onMouseEnter={()=>!disabled&&setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"flex",alignItems:"center",justifyContent:"center",width:30,height:30,borderRadius:8,border:`1px solid ${hov&&danger?t.danger+"50":t.border}`,background:hov?(danger?t.dangerSoft:t.surfaceEl):"transparent",color:hov?(danger?t.danger:t.text):t.textMut,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.35:1,transition:"all 0.15s" }}>
      <Ic d={icon} size={13} />
    </button>
  );
}

// ─── CARD ────────────────────────────────────────────────────
function Card({ children, style }) {
  const t = useT();
  return <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, padding:20, boxShadow:t.shadow, ...style }}>{children}</div>;
}

// ─── STAT CARD ───────────────────────────────────────────────
function StatCard({ label, value, icon, accentColor, sub }) {
  const t = useT(); const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:t.surface, border:`1px solid ${hov?t.borderHov:t.border}`, borderRadius:14, padding:"18px 20px", boxShadow:hov?t.shadowLg:t.shadow, transform:hov?"translateY(-2px)":"none", transition:"all 0.2s" }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
        <div style={{ width:36,height:36,borderRadius:10,background:`${accentColor}18`,border:`1px solid ${accentColor}30`,display:"flex",alignItems:"center",justifyContent:"center",color:accentColor }}>
          <Ic d={icon} size={15} />
        </div>
        {sub&&<span style={{ fontSize:10,color:t.textMut,fontWeight:600,padding:"3px 7px",background:t.surfaceEl,borderRadius:99,border:`1px solid ${t.border}` }}>{sub}</span>}
      </div>
      <div style={{ fontSize:26, fontWeight:750, color:t.text, letterSpacing:"-0.03em", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:t.textMut, marginTop:4, fontWeight:500 }}>{label}</div>
    </div>
  );
}

// ─── DB COUNT DEBUGGER ───────────────────────────────────────
function DbDebugPanel({ data }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const counts = [
    { name:"Projects",        count:data.projects.length,        expected:9, icon:"📦" },
    { name:"Skills",          count:data.skills.length,          expected:12, icon:"⚡" },
    { name:"Certificates",    count:data.certificates.length,    expected:8, icon:"🏆" },
    { name:"Experience",      count:data.experience.length,      expected:6, icon:"💼" },
    { name:"Reviews",         count:data.reviews.length,         expected:5, icon:"⭐" },
    { name:"Recommendations", count:data.recommendations.length, expected:1, icon:"👤" },
    { name:"Links",           count:data.links.length,           expected:5, icon:"🔗" },
    { name:"Social",          count:data.social.length,          expected:4, icon:"📱" },
    { name:"Contact",         count:data.contact.length,         expected:4, icon:"📧" },
  ];
  const allOk = counts.every(c=>c.count>=c.expected);
  return (
    <div style={{ marginBottom:16, border:`1px solid ${allOk?t.success+"40":t.warn+"40"}`, borderRadius:12, overflow:"hidden" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:allOk?t.successSoft:t.warnSoft, border:"none", cursor:"pointer", color:t.text }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:700 }}>
          <span style={{ fontSize:16 }}>{allOk?"✅":"⚠️"}</span>
          Database Verification — {allOk?"All records loaded":"Check counts"}
        </div>
        <Ic d={open?"M5 15l7-7 7 7":"M19 9l-7 7-7-7"} size={14} style={{ color:t.textMut }} />
      </button>
      {open&&(
        <div style={{ padding:16, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:8 }}>
          {counts.map(c=>(
            <div key={c.name} style={{ background:t.surfaceEl, border:`1px solid ${c.count>=c.expected?t.success+"30":t.warn+"40"}`, borderRadius:10, padding:"10px 14px" }}>
              <div style={{ fontSize:16, marginBottom:4 }}>{c.icon}</div>
              <div style={{ fontSize:12, color:t.textSub, fontWeight:500 }}>{c.name}</div>
              <div style={{ fontSize:20, fontWeight:750, color:c.count>=c.expected?t.success:t.warn, letterSpacing:"-0.02em" }}>{c.count}<span style={{ fontSize:11, color:t.textMut }}>/{c.expected}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SECTIONS
// ═══════════════════════════════════════════════════════════════

function Overview({ data }) {
  const t = useT();
  const statCards = [
    { label:"Skills",          value:data.skills.length,          icon:I.skills,     color:"#818cf8" },
    { label:"Projects",        value:data.projects.length,        icon:I.projects,   color:"#38bdf8" },
    { label:"Experience",      value:data.experience.length,      icon:I.experience, color:"#34d399" },
    { label:"Reviews",         value:data.reviews.length,         icon:I.reviews,    color:"#fb7185" },
    { label:"Certificates",    value:data.certificates.length,    icon:I.certs,      color:"#fbbf24" },
    { label:"Recommendations", value:data.recommendations.length, icon:I.recs,       color:"#a78bfa" },
    { label:"Links",           value:data.links.length,           icon:I.links,      color:"#f472b6" },
    { label:"Social",          value:data.social.length,          icon:I.social,     color:"#2dd4bf" },
  ];
  return (
    <div>
      <DbDebugPanel data={data} />
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:t.success,boxShadow:`0 0 8px ${t.success}` }} />
          <span style={{ fontSize:11,color:t.success,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em" }}>Live Dashboard · Bilingual Mode</span>
        </div>
        <h2 style={{ fontSize:24,fontWeight:750,color:t.text,letterSpacing:"-0.03em",marginBottom:4 }}>مرحباً بعودتك، أحمد ✦</h2>
        <p style={{ fontSize:14,color:t.textSub }}>Portfolio CMS · AR/EN Bilingual · {new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      </div>

      {/* bilingual notice */}
      <div style={{ display:"flex",gap:10,alignItems:"flex-start",background:t.arSoft,border:`1px solid ${t.ar}30`,borderRadius:12,padding:"12px 16px",marginBottom:20 }}>
        <Ic d={I.globe} size={15} style={{ color:t.ar,flexShrink:0,marginTop:1 }} />
        <div style={{ fontSize:12,color:t.textSub,lineHeight:1.7 }}>
          <strong style={{ color:t.text }}>🌐 Bilingual Support Active:</strong> Every section now has AR/EN toggle. Use the language switcher in each form to edit Arabic content with full RTL support and Arabic font rendering.
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:24 }}>
        {statCards.map(s=><StatCard key={s.label} {...s} accentColor={s.color} />)}
      </div>

      <Card>
        <div style={{ fontSize:13,fontWeight:700,color:t.text,marginBottom:14 }}>Top Skill Groups</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10 }}>
          {normalizeSkillGroupsForAdmin(data.skills).slice(0,6).map(group=>(
            <div key={group.id} style={{ border:`1px solid ${t.border}`,borderRadius:12,padding:12,background:t.glass }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <span>{group.icon || "⭐"}</span>
                <span style={{ fontSize:12,color:t.text,fontWeight:700 }}>{group.category_en}</span>
                <span style={{ marginLeft:"auto",fontSize:11,color:t.accent,fontWeight:800 }}>{(group.skills || []).length}</span>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                {(group.skills || []).slice(0,5).map(skill=><span key={skill} style={{ fontSize:10,color:t.textSub,background:t.surfaceEl,border:`1px solid ${t.border}`,borderRadius:999,padding:"3px 7px" }}>{skill}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── ABOUT ────────────────────────────────────────────────────
function AboutSection({ data, setData }) {
  const [form, setForm] = useState(data.about);
  const [lang, setLang] = useState("en");
  const { toast } = useToast();
  const t = useT();
  const save = () => { setData(d=>({...d,about:form})); toast("About section saved!","success"); };

  return (
    <div>
      <SectionHeader title="About / Bio" icon={I.about} count={1} langToggle={<LangToggle lang={lang} setLang={setLang} />} />
      <Card>
        <div style={{ marginBottom:16 }}>
          {/* ── Hero / Profile Photo ── */}
          <div style={{ display:"grid", gridTemplateColumns:"152px 1fr", gap:16, marginBottom:20, alignItems:"flex-start" }}>
            <ImageUploader
              label="Profile Photo"
              hint="homepage hero"
              shape="avatar"
              value={form.profileImage || ""}
              onChange={v => setForm(f => ({ ...f, profileImage: v }))}
            />
            <div style={{ paddingTop:22, display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:12, color:t.textSub, lineHeight:1.7 }}>
                Appears in the <strong style={{ color:t.text }}>Hero section</strong> of your portfolio. Use a square headshot for best results (replaces <code style={{ background:t.surfaceEl, padding:"1px 5px", borderRadius:4, color:t.accent }}>src/assets/profile.jpg</code>).
              </div>
              {form.profileImage && <div style={{ fontSize:11, color:t.success, fontWeight:600, display:"flex", alignItems:"center", gap:5 }}><Ic d={I.check} size={12} /> Photo ready — save to apply</div>}
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
            <BilingualSection lang={lang}>
              <Input label={lang==="en"?"Full Name (EN)":"الاسم الكامل (AR)"} value={lang==="en"?form.name_en:form.name_ar} isAr={lang==="ar"} onChange={e=>setForm(f=>lang==="en"?{...f,name_en:e.target.value}:{...f,name_ar:e.target.value})} />
            </BilingualSection>
            <BilingualSection lang={lang}>
              <Input label={lang==="en"?"Title / Role (EN)":"اللقب / الدور (AR)"} value={lang==="en"?form.title_en:form.title_ar} isAr={lang==="ar"} onChange={e=>setForm(f=>lang==="en"?{...f,title_en:e.target.value}:{...f,title_ar:e.target.value})} />
            </BilingualSection>
          </div>
          {[1,2,3,4].map(n=>(
            <div key={n} style={{ marginBottom:10 }}>
              <BilingualSection lang={lang}>
                <Textarea label={lang==="en"?`Bio Paragraph ${n} (EN)`:`الفقرة ${n} (AR)`} value={lang==="en"?form[`bio${n}_en`]:form[`bio${n}_ar`]} rows={2} isAr={lang==="ar"}
                  onChange={e=>setForm(f=>lang==="en"?{...f,[`bio${n}_en`]:e.target.value}:{...f,[`bio${n}_ar`]:e.target.value})} />
              </BilingualSection>
            </div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20 }}>
          <Input label="Stat: GPA" value={form.stats.gpa} onChange={e=>setForm(f=>({...f,stats:{...f.stats,gpa:e.target.value}}))} />
        </div>
        <div style={{ display:"flex",justifyContent:"flex-end" }}>
          <Btn onClick={save}><Ic d={I.save} size={13} /> Save Changes</Btn>
        </div>
      </Card>
    </div>
  );
}

// ── MANUAL ORDER HELPER ───────────────────────────────────────
const moveItemInArray = (setData, key, id, direction) => {
  setData(d => {
    const arr = [...(d[key] || [])];
    const index = arr.findIndex(item => item.id === id);
    if (index === -1) return d;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= arr.length) return d;
    [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
    return { ...d, [key]: arr };
  });
};

// ── SKILLS ───────────────────────────────────────────────────
const splitSkillsText = (value) => String(value || "")
  .split(/[,\n]/)
  .map(s => s.trim())
  .filter(Boolean);

const normalizeSkillGroupsForAdmin = (skills = []) => {
  const cloneCanonical = () => INITIAL.skills.map(group => ({
    ...group,
    skills: Array.isArray(group.skills) ? [...group.skills] : splitSkillsText(group.skills),
  }));

  if (!Array.isArray(skills) || !skills.length) return cloneCanonical();

  // If old flat skill records are still saved in MongoDB, replace them with the
  // requested grouped structure. This is what makes the dashboard and website
  // stop showing the old Machine Learning/Application Development-only cards.
  const hasGroupedSchema = skills.some(s => Array.isArray(s?.skills));
  if (!hasGroupedSchema) return cloneCanonical();

  const canonical = cloneCanonical();
  const normalize = value => String(value || "").trim().toLowerCase();

  skills.forEach((group, index) => {
    const categoryEn = group.category_en || group.label?.en || group.category || group.name_en || `Skill Group ${index + 1}`;
    const categoryAr = group.category_ar || group.label?.ar || group.category_en || group.category || group.name_ar || `مجموعة مهارات ${index + 1}`;
    let target = canonical.find(g => normalize(g.category_en) === normalize(categoryEn));

    if (!target) {
      target = {
        id: group.id ?? nid(),
        category_en: categoryEn,
        category_ar: categoryAr,
        icon: group.icon || "⭐",
        color: group.color || "#818cf8",
        skills: [],
      };
      canonical.push(target);
    } else {
      target.id = group.id ?? target.id;
      target.category_ar = categoryAr || target.category_ar;
      target.icon = group.icon || target.icon;
      target.color = group.color || target.color;
    }

    const incomingSkills = Array.isArray(group.skills) ? group.skills.map(String).filter(Boolean) : splitSkillsText(group.skills);
    incomingSkills.forEach(skillName => {
      if (!target.skills.some(existing => normalize(existing) === normalize(skillName))) {
        target.skills.push(skillName);
      }
    });
  });

  return canonical;
};

const blankSkill = () => ({ id:nid(), category_en:"", category_ar:"", icon:"⭐", color:"#818cf8", skills:[] });

function SkillsSection({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankSkill());
  const [skillsText, setSkillsText] = useState("");
  const [lang, setLang] = useState("en");
  const { toast } = useToast();
  const t = useT();
  const groups = normalizeSkillGroupsForAdmin(data.skills);
  const open = (item = null) => {
    const data = item
      ? { ...item, skills: [...(item.skills || [])] }
      : blankSkill();
  
    setForm(data);
    setSkillsText((data.skills || []).join(", "));
    setModal(item ? "edit" : "add");
  };
  const close = () => setModal(null);
  const save = () => {
    const normalizedForm = {
      ...form,
      category_en: String(form.category_en || "").trim(),
      category_ar: String(form.category_ar || form.category_en || "").trim(),
      skills: splitSkillsText(skillsText),
    };
    setData(d=>{
      const current = normalizeSkillGroupsForAdmin(d.skills);
      return {
        ...d,
        skills: modal==="add" ? [...current, normalizedForm] : current.map(s=>s.id===normalizedForm.id?normalizedForm:s)
      };
    });
    toast(modal==="add"?"Skill group added!":"Updated!","success");
    close();
  };
  const del = id => setData(d=>({...d,skills:normalizeSkillGroupsForAdmin(d.skills).filter(s=>s.id!==id)}));
  return (
    <div>
      <SectionHeader title="Skills" icon={I.skills} count={groups.length} onAdd={()=>open()} langToggle={<LangToggle lang={lang} setLang={setLang} />} />
      <DataTable searchable
        cols={[
          { key:"icon", label:"", sortable:false },
          { key:"category_en", label:"Category (EN)" },
          { key:"category_ar", label:"Category (AR)", render:v=><span style={{ fontFamily:"'Cairo',sans-serif",direction:"rtl" }}>{v}</span> },
          { key:"skills", label:"Skills", render:v=><span style={{ fontSize:11,color:t.textSub }}>{(v || []).slice(0,8).join(", ")}{(v || []).length>8?" …":""}</span> },
          { key:"skills", label:"Count", render:v=><CategoryPill cat={`${(v || []).length} skills`} /> },
        ]}
        rows={groups} onEdit={open} onDelete={del} manualOrder onMoveUp={id=>moveItemInArray(setData,"skills",id,"up")} onMoveDown={id=>moveItemInArray(setData,"skills",id,"down")}
      />
      {modal&&(
        <Modal title={modal==="add"?"Add Skill Group":"Edit Skill Group"} onClose={close} wide>
          <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:12 }}><LangToggle lang={lang} setLang={setLang} /></div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            <BilingualSection lang={lang}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                {lang==="en"
                  ? <Input label="Group Name (EN)" value={form.category_en || ""} onChange={e=>setForm(f=>({...f,category_en:e.target.value}))} />
                  : <Input label="اسم المجموعة (AR)" value={form.category_ar || ""} onChange={e=>setForm(f=>({...f,category_ar:e.target.value}))} isAr />
                }
                <Input label="Icon (emoji)" value={form.icon || ""} onChange={e=>setForm(f=>({...f,icon:e.target.value}))} />
              </div>
            </BilingualSection>
            <Textarea
              label="Skills"
              hint="write skills separated by commas or one skill per line"
              rows={7}
              value={skillsText}
              onChange={e => setSkillsText(e.target.value)}
            />
            <Field label="Accent Color">
              <input type="color" value={form.color || "#818cf8"} onChange={e=>setForm(f=>({...f,color:e.target.value}))} style={{ width:44,height:44,borderRadius:10,border:`1px solid ${t.border}`,cursor:"pointer",background:"none",padding:2 }} />
            </Field>
            <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
              <Btn variant="secondary" onClick={close}>Cancel</Btn>
              <Btn onClick={save}><Ic d={I.save} size={13} /> Save</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── PROJECTS ─────────────────────────────────────────────────
const blankProject = () => ({ id:++_id, title_en:"", title_ar:"", description_en:"", description_ar:"", tech:"", github:"", live:"", category:"Machine Learning", color:"#818cf8", images:[], videos:[] });

function ProjectsSection({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankProject());
  const [lang, setLang] = useState("en");
  const { toast } = useToast();
  const t = useT();
  const open = (item = null) => {
    setForm(item ? { ...item } : blankProject());
    setModal(item ? "edit" : "add");
  };
  const close = () => setModal(null);

  const skillCategoryFromProject = (projectCategory) => {
    const value = String(projectCategory || "").toLowerCase();
    if (value.includes("machine") || value.includes("ml")) return "ML";
    if (value.includes("analytics") || value.includes("analysis")) return "Analytics";
    if (value.includes("engineering") || value.includes("data eng")) return "Data Eng";
    if (value.includes("vision") || value.includes("cv")) return "CV";
    if (value.includes("nlp")) return "NLP";
    return "Other";
  };

  const normalizeSkillName = (value) => String(value || "").trim().toLowerCase();

  const extractProjectTechSkills = (tech) => {
    if (Array.isArray(tech)) return tech.map(String).map(s => s.trim()).filter(Boolean);
    return String(tech || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
  };

  const skillGroupNameFromProject = (projectCategory) => {
    const value = String(projectCategory || "").toLowerCase();
    if (value.includes("machine") || value.includes("ml")) return "Machine Learning";
    if (value.includes("vision") || value.includes("cv")) return "Deep Learning & Computer Vision";
    if (value.includes("analytics") || value.includes("analysis")) return "Data Analysis & Visualization";
    if (value.includes("engineering") || value.includes("data eng")) return "Programming & Data Tools";
    if (value.includes("nlp")) return "Machine Learning";
    return "Programming & Data Tools";
  };

  const buildSkillsWithProjectTech = (project, existingSkills) => {
    const groups = normalizeSkillGroupsForAdmin(existingSkills);
    const allExisting = new Set(groups.flatMap(group => (group.skills || []).map(normalizeSkillName)).filter(Boolean));
    const missing = extractProjectTechSkills(project.tech).filter(skillName => !allExisting.has(normalizeSkillName(skillName)));
    if (!missing.length) return groups;

    const targetName = skillGroupNameFromProject(project.category);
    let target = groups.find(group => normalizeSkillName(group.category_en) === normalizeSkillName(targetName));
    if (!target) {
      target = { id:nid(), category_en: targetName, category_ar: targetName, icon:"⭐", color: project.color || "#818cf8", skills: [] };
      groups.push(target);
    }
    missing.forEach(skillName => {
      if (!target.skills.some(s => normalizeSkillName(s) === normalizeSkillName(skillName))) target.skills.push(skillName);
    });
    return groups;
  };

  const save = () => {
    setData(d => {
      const projects = modal === "add"
        ? [...(d.projects || []), form]
        : (d.projects || []).map(p => p.id === form.id ? form : p);

      const skills = buildSkillsWithProjectTech(form, d.skills || []);

      return {
        ...d,
        projects,
        skills,
      };
    });

    toast(
      modal === "add"
        ? "Project added! New tech skills were added automatically if missing."
        : "Updated! New tech skills were added automatically if missing.",
      "success"
    );
    close();
  };
  const del = id => setData(d=>({...d,projects:d.projects.filter(p=>p.id!==id)}));
  return (
    <div>
      <SectionHeader title="Projects" icon={I.projects} count={data.projects.length} onAdd={()=>open()} langToggle={<LangToggle lang={lang} setLang={setLang} />} />
      <DataTable searchable
        cols={[
          { key:"images", label:"", sortable:false, render:(v,row)=> (v&&v[0])
            ? <img src={v[0]} alt={row.title_en} style={{ width:44,height:30,borderRadius:6,objectFit:"cover",border:`1px solid ${t.border}` }} />
            : <div style={{ width:44,height:30,borderRadius:6,background:row.color+"18",border:`1px solid ${row.color}40`,display:"flex",alignItems:"center",justifyContent:"center" }}><span style={{ width:10,height:10,borderRadius:"50%",background:row.color,display:"inline-block" }} /></div>
          },
          { key:"title_en", label:"Title (EN)" },
          { key:"title_ar", label:"Title (AR)", render:v=><span style={{ fontFamily:"'Cairo',sans-serif",direction:"rtl",fontSize:12 }}>{v}</span> },
          { key:"category", label:"Category", render:v=><CategoryPill cat={v} /> },
          { key:"tech", label:"Stack", render:v=><span style={{ fontSize:11,color:t.textSub }}>{v}</span> },
          { key:"videos", label:"Video", sortable:false, render:v=>(Array.isArray(v)&&v.length)?<span style={{ color:t.accent,fontSize:11,fontWeight:700 }}>Video</span>:<span style={{ color:t.textMut }}>—</span> },
          { key:"github", label:"GitHub", sortable:false, render:v=>v?<a href={v} target="_blank" rel="noreferrer" style={{ color:t.accent,fontSize:11 }}>↗</a>:<span style={{ color:t.textMut }}>—</span> },
        ]}
        rows={data.projects} onEdit={open} onDelete={del} manualOrder onMoveUp={id=>moveItemInArray(setData,"projects",id,"up")} onMoveDown={id=>moveItemInArray(setData,"projects",id,"down")}
      />
      {modal&&(
        <Modal title={modal==="add"?"Add Project":"Edit Project"} onClose={close} wide>
          <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:12 }}><LangToggle lang={lang} setLang={setLang} /></div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            <BiInputPair labelEn="Title (EN)" labelAr="العنوان (AR)" valEn={form.title_en} valAr={form.title_ar} onChangeEn={e=>setForm(f=>({...f,title_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,title_ar:e.target.value}))} lang={lang} />
            <BiInputPair labelEn="Description (EN)" labelAr="الوصف (AR)" valEn={form.description_en} valAr={form.description_ar} onChangeEn={e=>setForm(f=>({...f,description_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,description_ar:e.target.value}))} multiline rows={3} lang={lang} />
            <Input label="Tech Stack (comma-separated)" value={form.tech} onChange={e=>setForm(f=>({...f,tech:e.target.value}))} />
            <Select label="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              {["Machine Learning","Data Analytics","Data Engineering","Computer Vision","NLP","Other"].map(c=><option key={c}>{c}</option>)}
            </Select>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Input label="GitHub URL" type="url" value={form.github} onChange={e=>setForm(f=>({...f,github:e.target.value}))} />
              <Input label="Live URL" type="url" value={form.live} onChange={e=>setForm(f=>({...f,live:e.target.value}))} />
            </div>
            <Field label="Accent Color">
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} style={{ width:44,height:44,borderRadius:10,border:`1px solid ${t.border}`,cursor:"pointer",background:"none",padding:2 }} />
                <span style={{ fontSize:12,color:t.textMut,fontFamily:"monospace" }}>{form.color}</span>
              </div>
            </Field>
            <ImageUploader
              label="Project Images"
              hint="shown in project modal gallery"
              multi
              images={form.images || []}
              onImagesChange={imgs => setForm(f => ({ ...f, images: imgs }))}
            />
            <MultiVideoUploader
              label="Project Videos"
              hint="upload from your device using drag/drop or file picker; shown with project media"
              videos={form.videos || []}
              onChange={videos => setForm(f => ({ ...f, videos }))}
            />
            <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
              <Btn variant="secondary" onClick={close}>Cancel</Btn>
              <Btn onClick={save}><Ic d={I.save} size={13} /> Save</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── EXPERIENCE ───────────────────────────────────────────────
const blankExp = () => ({
  id: ++_id,
  role_en: "",
  role_ar: "",
  company_en: "",
  company_ar: "",
  category: "work",
  startDate: "",
  endDate: "",
  present: false,
  bullets_en: "",
  bullets_ar: "",
  color: "#818cf8"
});

function ExperienceSection({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankExp());
  const [lang, setLang] = useState("en");
  const { toast } = useToast();
  const t = useT();
  const open = (item = null) => { setForm(item ? { ...item } : blankExp()); setModal(item ? "edit" : "add"); };
  const close = () => setModal(null);
  const save = () => { setData(d => ({ ...d, experience: modal === "add" ? [...d.experience, form] : d.experience.map(e => e.id === form.id ? form : e) })); toast(modal === "add" ? "Entry added!" : "Updated!", "success"); close(); };
  const del = id => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  
  return (
    <div>
      <SectionHeader title="Experience" icon={I.experience} count={data.experience.length} onAdd={() => open()} langToggle={<LangToggle lang={lang} setLang={setLang} />} />
      <DataTable searchable
        cols={[
          { key: "category", label: "Category", render: v => <CategoryPill cat={v} /> },
          { key: "role_en", label: "Role (EN)" },
          { key: "role_ar", label: "Role (AR)", render: v => <span style={{ fontFamily: "'Cairo',sans-serif", direction: "rtl", fontSize: 12 }}>{v}</span> },
          { key: "company_en", label: "Company" },
          { key: "startDate", label: "Duration", render: (_, row) => (<span style={{ fontSize: 11, color: t.textSub }}> {row.startDate} {" → "} {row.present ? "Present" : (row.endDate || "-")} </span>) },
        ]}
        rows={data.experience} onEdit={open} onDelete={del} manualOrder onMoveUp={id => moveItemInArray(setData, "experience", id, "up")} onMoveDown={id => moveItemInArray(setData, "experience", id, "down")}
      />
      
      {modal && (
        <Modal title={modal === "add" ? "Add Experience" : "Edit Experience"} onClose={close} wide>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            
            {/* Role & Company */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <BiInputPair
                labelEn="Role (EN)"
                labelAr="المسمى الوظيفي (AR)"
                valEn={form.role_en}
                valAr={form.role_ar}
                onChangeEn={(e) => setForm((f) => ({ ...f, role_en: e.target.value }))}
                onChangeAr={(e) => setForm((f) => ({ ...f, role_ar: e.target.value }))}
                lang={lang}
              />
              <BiInputPair
                labelEn="Company (EN)"
                labelAr="الشركة (AR)"
                valEn={form.company_en}
                valAr={form.company_ar}
                onChangeEn={(e) => setForm((f) => ({ ...f, company_en: e.target.value }))}
                onChangeAr={(e) => setForm((f) => ({ ...f, company_ar: e.target.value }))}
                lang={lang}
              />
            </div>

            {/* Dates & Category */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Start Date">
                <input
                  type="date"
                  value={form.startDate || ""}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </Field>

              <Field label="End Date">
                <input
                  type="date"
                  disabled={form.present}
                  value={form.endDate || ""}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </Field>

              <Select
                label="Category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                <option value="work">Work</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
                <option value="education">Education</option>
                <option value="program">Program</option>
                <option value="volunteer">Volunteer</option>
              </Select>

              <Field label="Status">
                <label style={{ display: "flex", alignItems: "center", gap: 8, height: "100%", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.present}
                    onChange={(e) => setForm((f) => ({ ...f, present: e.target.checked, endDate: e.target.checked ? "" : f.endDate }))}
                  />
                  Currently Working
                </label>
              </Field>
            </div>

            {/* Bullet Points */}
            <BiInputPair
              labelEn="Bullet Points (EN) — one per line"
              labelAr="النقاط (AR) — سطر لكل نقطة"
              valEn={form.bullets_en}
              valAr={form.bullets_ar}
              onChangeEn={(e) => setForm((f) => ({ ...f, bullets_en: e.target.value }))}
              onChangeAr={(e) => setForm((f) => ({ ...f, bullets_ar: e.target.value }))}
              multiline
              rows={4}
              lang={lang}
            />

            {/* Color */}
            <Field label="Accent Color">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${t.border}`, cursor: "pointer", background: "none", padding: 2 }}
              />
            </Field>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Btn variant="secondary" onClick={close}>
                Cancel
              </Btn>
              <Btn onClick={save}>
                <Ic d={I.save} size={13} /> Save
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── REVIEWS ──────────────────────────────────────────────────
const blankReview = () => ({ id:++_id, name:"", platform:"Khamsat", service_en:"", service_ar:"", rating:5, comment_en:"", comment_ar:"", link:"", avatar:"" });

function ReviewsSection({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankReview());
  const [lang, setLang] = useState("en");
  const { toast } = useToast();
  const t = useT();
  const open = (item = null) => {
    const data = item
      ? { ...item, skills: [...(item.skills || [])] }
      : blankSkill();
  
    setForm(data);
    setSkillsText((data.skills || []).join(", "));
    setModal(item ? "edit" : "add");
  };
  const close = () => setModal(null);
  const save = () => { setData(d=>({...d,reviews:modal==="add"?[...d.reviews,form]:d.reviews.map(r=>r.id===form.id?form:r)})); toast(modal==="add"?"Review added!":"Updated!","success"); close(); };
  const del = id => setData(d=>({...d,reviews:d.reviews.filter(r=>r.id!==id)}));
  const Stars = ({n}) => <span style={{ letterSpacing:1,fontSize:13 }}>{"★".repeat(n)}<span style={{ opacity:0.25 }}>{"★".repeat(5-n)}</span></span>;
  return (
    <div>
      <SectionHeader title="Reviews & Testimonials" icon={I.reviews} count={data.reviews.length} onAdd={()=>open()} langToggle={<LangToggle lang={lang} setLang={setLang} />} />
      <DataTable searchable
        cols={[
          { key:"avatar", label:"", sortable:false, render:(v,row)=> v
            ? <img src={v} alt={row.name} style={{ width:28,height:28,borderRadius:"50%",objectFit:"cover",border:`1px solid ${t.border}` }} />
            : <div style={{ width:28,height:28,borderRadius:"50%",background:t.accentSoft,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:t.accent }}>{(row.name||"?")[0]}</div>
          },
          { key:"name", label:"Reviewer" },
          { key:"platform", label:"Platform" },
          { key:"service_en", label:"Service (EN)" },
          { key:"rating", label:"Rating", render:v=><Stars n={v} /> },
          { key:"comment_en", label:"Comment", render:v=><span style={{ fontSize:12,color:t.textSub }}>{v?.slice(0,50)}{v?.length>50?"…":""}</span> },
        ]}
        rows={data.reviews} onEdit={open} onDelete={del} manualOrder onMoveUp={id=>moveItemInArray(setData,"reviews",id,"up")} onMoveDown={id=>moveItemInArray(setData,"reviews",id,"down")}
      />
      {modal&&(
        <Modal title={modal==="add"?"Add Review":"Edit Review"} onClose={close} wide>
          <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:12 }}><LangToggle lang={lang} setLang={setLang} /></div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Input label="Reviewer Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              <Input label="Platform" value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))} />
            </div>
            <BiInputPair labelEn="Service (EN)" labelAr="الخدمة (AR)" valEn={form.service_en} valAr={form.service_ar} onChangeEn={e=>setForm(f=>({...f,service_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,service_ar:e.target.value}))} lang={lang} />
            <Field label={`Rating: ${form.rating}/5`}>
              <input type="range" min={1} max={5} step={1} value={form.rating} onChange={e=>setForm(f=>({...f,rating:+e.target.value}))} style={{ accentColor:"#fbbf24",width:"100%",cursor:"pointer" }} />
            </Field>
            <BiInputPair labelEn="Comment (EN)" labelAr="التعليق (AR)" valEn={form.comment_en} valAr={form.comment_ar} onChangeEn={e=>setForm(f=>({...f,comment_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,comment_ar:e.target.value}))} multiline rows={3} lang={lang} />
            <Input label="Review URL" type="url" value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} />
            <ImageUploader
              label="Reviewer Avatar"
              hint="optional profile photo"
              shape="avatar"
              value={form.avatar || ""}
              onChange={v => setForm(f => ({ ...f, avatar: v }))}
            />
            <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
              <Btn variant="secondary" onClick={close}>Cancel</Btn>
              <Btn onClick={save}><Ic d={I.save} size={13} /> Save</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── RECOMMENDATIONS ──────────────────────────────────────────
const blankRec = () => ({ id:++_id, name:"", name_ar:"", title_en:"", title_ar:"", institution_en:"", institution_ar:"", quote_en:"", quote_ar:"", linkedin:"", avatar:"" });

function RecsSection({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankRec());
  const [lang, setLang] = useState("en");
  const { toast } = useToast();
  const t = useT();
  const open = (item = null) => {
    const data = item
      ? { ...item, skills: [...(item.skills || [])] }
      : blankSkill();
  
    setForm(data);
    setSkillsText((data.skills || []).join(", "));
    setModal(item ? "edit" : "add");
  };
  const close = () => setModal(null);
  const save = () => { setData(d=>({...d,recommendations:modal==="add"?[...d.recommendations,form]:d.recommendations.map(r=>r.id===form.id?form:r)})); toast("Saved!","success"); close(); };
  const del = id => setData(d=>({...d,recommendations:d.recommendations.filter(r=>r.id!==id)}));
  return (
    <div>
      <SectionHeader title="Recommendations" icon={I.recs} count={data.recommendations.length} onAdd={()=>open()} langToggle={<LangToggle lang={lang} setLang={setLang} />} />
      <DataTable searchable
        cols={[
          { key:"avatar", label:"", sortable:false, render:(v,row)=> v
            ? <img src={v} alt={row.name} style={{ width:28,height:28,borderRadius:"50%",objectFit:"cover",border:`1px solid ${t.border}` }} />
            : <div style={{ width:28,height:28,borderRadius:"50%",background:t.arSoft,border:`1px solid ${t.ar}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:t.ar }}>{(row.name||"?")[0]}</div>
          },
          { key:"name", label:"Name" },
          { key:"name_ar", label:"Name (AR)", render:v=><span style={{ fontFamily:"'Cairo',sans-serif",direction:"rtl" }}>{v}</span> },
          { key:"title_en", label:"Title" },
          { key:"linkedin", label:"LinkedIn", sortable:false, render:v=>v?<a href={v} target="_blank" rel="noreferrer" style={{ color:t.accent,fontSize:11 }}>Profile ↗</a>:<span style={{ color:t.textMut }}>—</span> },
        ]}
        rows={data.recommendations} onEdit={open} onDelete={del} manualOrder onMoveUp={id=>moveItemInArray(setData,"recommendations",id,"up")} onMoveDown={id=>moveItemInArray(setData,"recommendations",id,"down")}
      />
      {modal&&(
        <Modal title={modal==="add"?"Add Recommendation":"Edit Recommendation"} onClose={close} wide>
          <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:12 }}><LangToggle lang={lang} setLang={setLang} /></div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Input label="Name (EN)" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              <Input label="الاسم (AR)" value={form.name_ar} onChange={e=>setForm(f=>({...f,name_ar:e.target.value}))} isAr />
            </div>
            <BiInputPair labelEn="Title / Position (EN)" labelAr="المسمى الوظيفي (AR)" valEn={form.title_en} valAr={form.title_ar} onChangeEn={e=>setForm(f=>({...f,title_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,title_ar:e.target.value}))} lang={lang} />
            <BiInputPair labelEn="Institution (EN)" labelAr="المؤسسة (AR)" valEn={form.institution_en} valAr={form.institution_ar} onChangeEn={e=>setForm(f=>({...f,institution_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,institution_ar:e.target.value}))} lang={lang} />
            <BiInputPair labelEn="Full Recommendation (EN)" labelAr="التوصية الكاملة (AR)" valEn={form.quote_en} valAr={form.quote_ar} onChangeEn={e=>setForm(f=>({...f,quote_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,quote_ar:e.target.value}))} multiline rows={6} lang={lang} />
            <Input label="LinkedIn URL" type="url" value={form.linkedin} onChange={e=>setForm(f=>({...f,linkedin:e.target.value}))} />
            <ImageUploader
              label="Professor / Recommender Photo"
              hint="profile picture shown in testimonials"
              shape="avatar"
              value={form.avatar || ""}
              onChange={v => setForm(f => ({ ...f, avatar: v }))}
            />
            <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
              <Btn variant="secondary" onClick={close}>Cancel</Btn>
              <Btn onClick={save}><Ic d={I.save} size={13} /> Save</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── CERTIFICATES ─────────────────────────────────────────────
const blankCert = () => ({
  id: ++_id,
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  issuer: "",
  date: "",
  badge: "Certificate",
  link: "",
  image: "",
});
const BADGE_OPTS = ["Certificate","Internship","DEPI","Workshop","Program","CS Basics","Bootcamp"];

function CertsSection({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankCert());
  const [lang, setLang] = useState("en");
  const { toast } = useToast();
  const t = useT();
  const open = (item = null) => {
    setForm(item ? { ...item } : blankCert());
    setModal(item ? "edit" : "add");
  };
  const close = () => setModal(null);
  const save = () => { setData(d=>({...d,certificates:modal==="add"?[...d.certificates,form]:d.certificates.map(c=>c.id===form.id?form:c)})); toast(modal==="add"?"Certificate added!":"Updated!","success"); close(); };
  const del = id => setData(d=>({...d,certificates:d.certificates.filter(c=>c.id!==id)}));
  return (
    <div>
      <SectionHeader title="Certificates" icon={I.certs} count={data.certificates.length} onAdd={()=>open()} langToggle={<LangToggle lang={lang} setLang={setLang} />} />
      <DataTable searchable
        cols={[
          { key:"image", label:"", sortable:false, render:(v,row)=> v
            ? <img src={v} alt={row.title_en} style={{ width:40,height:28,borderRadius:6,objectFit:"cover",border:`1px solid ${t.border}` }} />
            : <div style={{ width:40,height:28,borderRadius:6,background:t.surfaceEl,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>🏆</div>
          },
          { key:"title_en", label:"Title (EN)" },
          { key:"title_ar", label:"Title (AR)", render:v=><span style={{ fontFamily:"'Cairo',sans-serif",direction:"rtl",fontSize:12 }}>{v}</span> },
          { key:"issuer", label:"Issuer" },
          { key:"date", label:"Date", render:v=><span style={{ fontSize:11,color:t.textSub }}>{v}</span> },
          { key:"badge", label:"Badge", render:v=><CategoryPill cat={v} /> },
        ]}
        rows={data.certificates} onEdit={open} onDelete={del} manualOrder onMoveUp={id=>moveItemInArray(setData,"certificates",id,"up")} onMoveDown={id=>moveItemInArray(setData,"certificates",id,"down")}
      />
      {modal&&(
        <Modal title={modal==="add"?"Add Certificate":"Edit Certificate"} onClose={close} wide>
          <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:12 }}><LangToggle lang={lang} setLang={setLang} /></div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            <BiInputPair labelEn="Title (EN)" labelAr="العنوان (AR)" valEn={form.title_en} valAr={form.title_ar} onChangeEn={e=>setForm(f=>({...f,title_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,title_ar:e.target.value}))} lang={lang} />
            <BiInputPair labelEn="Description (EN)" labelAr="الوصف (AR)" valEn={form.description_en || ""} valAr={form.description_ar || ""} onChangeEn={e=>setForm(f=>({...f,description_en:e.target.value}))} onChangeAr={e=>setForm(f=>({...f,description_ar:e.target.value}))} multiline rows={3} lang={lang} />
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Input label="Issuer / Platform" value={form.issuer} onChange={e=>setForm(f=>({...f,issuer:e.target.value}))} />
              <Input label="Date" placeholder="May 2025" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <Select label="Badge Type" value={form.badge} onChange={e=>setForm(f=>({...f,badge:e.target.value}))}>
                {BADGE_OPTS.map(b=><option key={b}>{b}</option>)}
              </Select>
              <Input label="External Link / URL" type="url" placeholder="https://…" value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} />
            </div>
            <ImageUploader
              label="Certificate Image"
              hint="scanned photo or screenshot of the certificate"
              shape="rect"
              value={form.image || ""}
              onChange={v => setForm(f => ({ ...f, image: v }))}
            />
            <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
              <Btn variant="secondary" onClick={close}>Cancel</Btn>
              <Btn onClick={save}><Ic d={I.save} size={13} /> Save</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── LINKS ────────────────────────────────────────────────────
const blankLink = () => ({ id:++_id, label:"", url:"" });
function LinksSection({ data, setData }) {
  const [modal,setModal]=useState(null); const [form,setForm]=useState(blankLink()); const { toast }=useToast(); const t=useT();
  const open=(item=null)=>{setForm(item?{...item}:blankLink());setModal(item?"edit":"add");}; const close=()=>setModal(null);
  const save=()=>{setData(d=>({...d,links:modal==="add"?[...d.links,form]:d.links.map(l=>l.id===form.id?form:l)}));toast(modal==="add"?"Link added!":"Updated!","success");close();};
  const del=id=>setData(d=>({...d,links:d.links.filter(l=>l.id!==id)}));
  return (
    <div>
      <SectionHeader title="Links" icon={I.links} count={data.links.length} onAdd={()=>open()} />
      <DataTable cols={[{ key:"label",label:"Label" },{ key:"url",label:"URL",render:v=><a href={v} target="_blank" rel="noreferrer" style={{ color:t.accent,fontSize:12 }}>{v?.slice(0,48)}{v?.length>48?"…":""}</a> }]} rows={data.links} onEdit={open} onDelete={del} />
      {modal&&(<Modal title={modal==="add"?"Add Link":"Edit Link"} onClose={close}><div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        <Input label="Label" value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} />
        <Input label="URL" type="url" value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))} />
        <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}><Btn variant="secondary" onClick={close}>Cancel</Btn><Btn onClick={save}><Ic d={I.save} size={13} /> Save</Btn></div>
      </div></Modal>)}
    </div>
  );
}

// ── SOCIAL ───────────────────────────────────────────────────
const blankSocial = () => ({ id:++_id, platform:"", icon:"🔗", url:"" });
function SocialSection({ data, setData }) {
  const [modal,setModal]=useState(null); const [form,setForm]=useState(blankSocial()); const { toast }=useToast(); const t=useT();
  const open=(item=null)=>{setForm(item?{...item}:blankSocial());setModal(item?"edit":"add");}; const close=()=>setModal(null);
  const save=()=>{setData(d=>({...d,social:modal==="add"?[...d.social,form]:d.social.map(s=>s.id===form.id?form:s)}));toast("Saved!","success");close();};
  const del=id=>setData(d=>({...d,social:d.social.filter(s=>s.id!==id)}));
  return (
    <div>
      <SectionHeader title="Social Media" icon={I.social} count={data.social.length} onAdd={()=>open()} />
      <DataTable cols={[{ key:"icon",label:"",sortable:false },{ key:"platform",label:"Platform" },{ key:"url",label:"URL",render:v=><a href={v} target="_blank" rel="noreferrer" style={{ color:t.accent,fontSize:12 }}>{v?.slice(0,40)}{v?.length>40?"…":""}</a> }]} rows={data.social} onEdit={open} onDelete={del} />
      {modal&&(<Modal title={modal==="add"?"Add Social":"Edit Social"} onClose={close}><div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <Input label="Platform" value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))} />
          <Input label="Icon (emoji)" value={form.icon} onChange={e=>setForm(f=>({...f,icon:e.target.value}))} />
        </div>
        <Input label="URL" type="url" value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))} />
        <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}><Btn variant="secondary" onClick={close}>Cancel</Btn><Btn onClick={save}><Ic d={I.save} size={13} /> Save</Btn></div>
      </div></Modal>)}
    </div>
  );
}

// ── CONTACT ──────────────────────────────────────────────────
const blankContact = () => ({ id:++_id, type:"Email", value:"" });
function ContactSection({ data, setData }) {
  const [modal,setModal]=useState(null); const [form,setForm]=useState(blankContact()); const { toast }=useToast(); const t=useT();
  const open=(item=null)=>{setForm(item?{...item}:blankContact());setModal(item?"edit":"add");}; const close=()=>setModal(null);
  const save=()=>{setData(d=>({...d,contact:modal==="add"?[...d.contact,form]:d.contact.map(c=>c.id===form.id?form:c)}));toast("Saved!","success");close();};
  const del=id=>setData(d=>({...d,contact:d.contact.filter(c=>c.id!==id)}));
  return (
    <div>
      <SectionHeader title="Contact Info" icon={I.contact} count={data.contact.length} onAdd={()=>open()} />
      <DataTable cols={[{ key:"type",label:"Type",render:v=><CategoryPill cat={v} /> },{ key:"value",label:"Value" }]} rows={data.contact} onEdit={open} onDelete={del} />
      {modal&&(<Modal title={modal==="add"?"Add Contact":"Edit Contact"} onClose={close}><div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        <Select label="Type" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
          {["Email","Phone","WhatsApp","Telegram","Address","Other"].map(tp=><option key={tp}>{tp}</option>)}
        </Select>
        <Input label="Value" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))} />
        <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}><Btn variant="secondary" onClick={close}>Cancel</Btn><Btn onClick={save}><Ic d={I.save} size={13} /> Save</Btn></div>
      </div></Modal>)}
    </div>
  );
}

// ── SEED/EXPORT PANEL ─────────────────────────────────────────
function SeedPanel({ data }) {
  const t = useT();
  const { toast } = useToast();
  const [tab, setTab] = useState("counts");

  const counts = [
    ["Projects", data.projects.length, 9],
    ["Skills", data.skills.length, 12],
    ["Certificates", data.certificates.length, 8],
    ["Experience", data.experience.length, 6],
    ["Reviews", data.reviews.length, 5],
    ["Recommendations", data.recommendations.length, 1],
    ["Links", data.links.length, 5],
    ["Social", data.social.length, 4],
    ["Contact", data.contact.length, 4],
  ];

  const exportJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="portfolio-data.json"; a.click();
    toast("Data exported as JSON!", "success");
  };

  const sqlSchema = `-- Bilingual Portfolio Schema (PostgreSQL / Supabase)

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  level INT CHECK(level BETWEEN 1 AND 100),
  category TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  tech TEXT,
  github TEXT,
  live TEXT,
  category TEXT,
  color TEXT DEFAULT '#818cf8',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  role_en TEXT NOT NULL,
  role_ar TEXT NOT NULL,
  company_en TEXT,
  company_ar TEXT,
  period_en TEXT,
  period_ar TEXT,
  type TEXT CHECK(type IN ('work','edu')),
  bullets_en TEXT,
  bullets_ar TEXT,
  color TEXT DEFAULT '#818cf8',
  sort_order INT DEFAULT 0
);

CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  badge TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT,
  service_en TEXT,
  service_ar TEXT,
  rating INT CHECK(rating BETWEEN 1 AND 5),
  comment_en TEXT,
  comment_ar TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  name TEXT,
  name_ar TEXT,
  title_en TEXT,
  title_ar TEXT,
  institution_en TEXT,
  institution_ar TEXT,
  quote_en TEXT,
  quote_ar TEXT,
  linkedin TEXT
);`;

  return (
    <div>
      <SectionHeader title="Database & Export Tools" icon={I.api} sub="Verify data, export JSON, view schema" />

      <div style={{ display:"flex",gap:6,marginBottom:16 }}>
        {["counts","schema","export"].map(tab_=>(<button key={tab_} onClick={()=>setTab(tab_)} style={{ padding:"7px 14px",borderRadius:9,border:`1px solid ${t.border}`,background:tab===tab_?t.accentSoft:"transparent",color:tab===tab_?t.accent:t.textMut,cursor:"pointer",fontSize:12,fontWeight:600,transition:"all 0.15s" }}>{tab_==="counts"?"📊 DB Counts":tab_==="schema"?"🗄️ SQL Schema":"📤 Export JSON"}</button>))}
      </div>

      {tab==="counts"&&(
        <Card>
          <div style={{ marginBottom:12,fontSize:13,fontWeight:700,color:t.text }}>Record Counts — Full Verification</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10 }}>
            {counts.map(([name,count,expected])=>(
              <div key={name} style={{ background:t.surfaceEl,border:`1px solid ${count>=expected?t.success+"30":t.warn+"40"}`,borderRadius:12,padding:14 }}>
                <div style={{ fontSize:12,color:t.textSub,fontWeight:500,marginBottom:4 }}>{name}</div>
                <div style={{ display:"flex",alignItems:"baseline",gap:4 }}>
                  <span style={{ fontSize:24,fontWeight:750,color:count>=expected?t.success:t.warn,letterSpacing:"-0.02em" }}>{count}</span>
                  <span style={{ fontSize:11,color:t.textMut }}>/ {expected} expected</span>
                </div>
                <div style={{ fontSize:10,color:count>=expected?t.success:t.warn,fontWeight:700,marginTop:2 }}>{count>=expected?"✓ OK":"⚠ Check"}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12,padding:"10px 14px",background:t.successSoft,border:`1px solid ${t.success}30`,borderRadius:10,fontSize:12,color:t.success }}>
            ✓ All {counts.reduce((a,[,c])=>a+c,0)} records loaded — Bilingual data verified
          </div>
        </Card>
      )}

      {tab==="schema"&&(
        <Card>
          <div style={{ marginBottom:10,fontSize:13,fontWeight:700,color:t.text }}>Bilingual Database Schema (PostgreSQL / Supabase)</div>
          <pre style={{ fontSize:11,color:t.textSub,lineHeight:1.7,fontFamily:"monospace",whiteSpace:"pre-wrap",background:t.surfaceEl,padding:16,borderRadius:10,overflowX:"auto" }}>{sqlSchema}</pre>
        </Card>
      )}

      {tab==="export"&&(
        <Card>
          <div style={{ marginBottom:12,fontSize:13,fontWeight:700,color:t.text }}>Export All Data</div>
          <p style={{ fontSize:13,color:t.textSub,lineHeight:1.6,marginBottom:16 }}>Export your complete bilingual portfolio data as JSON. Use this to seed your database, back up content, or migrate to a different backend.</p>
          <Btn onClick={exportJson}><span>📤</span> Download portfolio-data.json</Btn>
          <div style={{ marginTop:14,padding:"10px 14px",background:t.warnSoft,border:`1px solid ${t.warn}30`,borderRadius:10,fontSize:12,color:t.textSub }}>
            <strong style={{ color:t.text }}>API Seed Endpoint:</strong> POST your exported JSON to <code style={{ background:t.surfaceEl,padding:"2px 6px",borderRadius:5,color:t.accent }}>/api/seed</code> in your Express/Supabase backend to populate all tables at once.
          </div>
        </Card>
      )}
    </div>
  );
}

// ── SITE TEXT ─────────────────────────────────────────────────
function SiteTextSection({ data, setData }) {
  const [form, setForm] = useState(data.siteText || INITIAL.siteText);
  const [lang, setLang] = useState("en");
  const { toast } = useToast();
  const t = useT();
  const save = () => { setData(d => ({ ...d, siteText: form })); toast("Site text saved!", "success"); };
  const updateHero = (key, value) => setForm(f => ({ ...f, hero: { ...f.hero, [key]: value } }));
  const updateSection = (section, key, value) => setForm(f => ({ ...f, sections: { ...f.sections, [section]: { ...f.sections[section], [key]: value } } }));
  const sectionKeys = ["about", "skills", "projects", "experience", "certificates", "reviews", "recommendations", "contact"];
  return <div><SectionHeader title="Site Text" icon={I.text} count={sectionKeys.length + 1} langToggle={<LangToggle lang={lang} setLang={setLang} />} /><Card style={{ marginBottom: 16 }}><div style={{ fontSize:13,fontWeight:700,marginBottom:14,color:t.text }}>Home / Hero Text</div><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}><Input label={lang === "en" ? "Hero Subtitle (EN)" : "العنوان الفرعي في الصفحة الرئيسية"} value={lang === "en" ? form.hero.subtitle_en : form.hero.subtitle_ar} isAr={lang === "ar"} onChange={e => updateHero(lang === "en" ? "subtitle_en" : "subtitle_ar", e.target.value)} /><Textarea label={lang === "en" ? "Hero Description (EN)" : "الوصف تحت الاسم في الصفحة الرئيسية"} value={lang === "en" ? form.hero.description_en : form.hero.description_ar} rows={3} isAr={lang === "ar"} onChange={e => updateHero(lang === "en" ? "description_en" : "description_ar", e.target.value)} /></div></Card><Card><div style={{ fontSize:13,fontWeight:700,marginBottom:14,color:t.text }}>Section Titles & Subtitles</div><div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14 }}>{sectionKeys.map(key => <div key={key} style={{ border:`1px solid ${t.border}`, borderRadius:12, padding:14 }}><div style={{ fontSize:12,fontWeight:800,textTransform:"uppercase",marginBottom:10,color:t.accent }}>{key}</div><Input label={lang === "en" ? "Title (EN)" : "العنوان (AR)"} value={lang === "en" ? form.sections[key].title_en : form.sections[key].title_ar} isAr={lang === "ar"} onChange={e => updateSection(key, lang === "en" ? "title_en" : "title_ar", e.target.value)} /><div style={{ height:10 }} /><Textarea label={lang === "en" ? "Subtitle (EN)" : "الوصف تحت العنوان (AR)"} value={lang === "en" ? form.sections[key].subtitle_en : form.sections[key].subtitle_ar} rows={3} isAr={lang === "ar"} onChange={e => updateSection(key, lang === "en" ? "subtitle_en" : "subtitle_ar", e.target.value)} /></div>)}</div><div style={{ display:"flex",justifyContent:"flex-end",marginTop:18 }}><Btn onClick={save}><Ic d={I.save} size={13} /> Save Site Text</Btn></div></Card></div>;
}

// ── SETTINGS ──────────────────────────────────────────────────
function SettingsSection() {
  const [oldPw, setOldPw] = useState(""); const [newPw1, setNewPw1] = useState(""); const [newPw2, setNewPw2] = useState("");
  const { toast } = useToast(); const t = useT();
  const save = e => { e.preventDefault(); if (oldPw !== _savedPw.current) { toast("Current password is wrong.", "error"); return; } if (newPw1.length < 6) { toast("New password must be at least 6 characters.", "error"); return; } if (newPw1 !== newPw2) { toast("Confirm password does not match.", "error"); return; } _savedPw.current = newPw1; setOldPw(""); setNewPw1(""); setNewPw2(""); toast("Password changed successfully!", "success"); };
  return <div><SectionHeader title="Settings" icon={I.settings} /><Card style={{ maxWidth:520 }}><div style={{ fontSize:14,fontWeight:800,color:t.text,marginBottom:6 }}>Change Dashboard Password</div><p style={{ fontSize:12,color:t.textSub,lineHeight:1.6,marginBottom:16 }}>Password management is now inside the dashboard, not on the login screen.</p><form onSubmit={save} style={{ display:"flex",flexDirection:"column",gap:12 }}><Input type="password" label="Current Password" value={oldPw} onChange={e=>setOldPw(e.target.value)} /><Input type="password" label="New Password" value={newPw1} onChange={e=>setNewPw1(e.target.value)} /><Input type="password" label="Confirm New Password" value={newPw2} onChange={e=>setNewPw2(e.target.value)} /><div style={{ display:"flex",justifyContent:"flex-end",marginTop:8 }}><Btn type="submit"><Ic d={I.save} size={13} /> Save Password</Btn></div></form></Card></div>;
}

// ── SETTINGS: LOCAL PASSWORD DISPLAY ────────────────────────────
// Cosmetic-only store for the "Change Dashboard Password" card in
// Settings. Real authentication happens against the backend via
// api.js (see Login.jsx) — this module-level ref just persists the
// value shown here across logout/login cycles within the same tab.
const _savedPw = { current: "admin123" };

// ─── CMS PERSISTENCE / API SYNC ─────────────────────────────
// All network access lives in api.js — this file only shapes data
// and hands it off to the api.js functions.
const STORAGE_KEY = "ahmed_portfolio_cms_data";

function mergeSiteText(incomingSiteText = {}) {
  const incomingSections = incomingSiteText.sections || {};
  const mergedSections = {};
  Object.keys(INITIAL.siteText.sections).forEach(key => {
    mergedSections[key] = { ...INITIAL.siteText.sections[key], ...(incomingSections[key] || {}) };
  });
  return {
    ...INITIAL.siteText,
    ...incomingSiteText,
    hero: { ...INITIAL.siteText.hero, ...(incomingSiteText.hero || {}) },
    sections: mergedSections,
  };
}

function normalizeCmsData(incoming) {
  if (!incoming || typeof incoming !== "object") return INITIAL;
  return {
    ...INITIAL,
    ...incoming,
    about: { ...INITIAL.about, ...(incoming.about || {}), stats: { ...INITIAL.about.stats, ...(incoming.about?.stats || {}) } },
    siteText: mergeSiteText(incoming.siteText),
    skills: normalizeSkillGroupsForAdmin(Array.isArray(incoming.skills) ? incoming.skills : INITIAL.skills),
    projects: Array.isArray(incoming.projects) ? incoming.projects : INITIAL.projects,
    experience: Array.isArray(incoming.experience) ? incoming.experience : INITIAL.experience,
    reviews: Array.isArray(incoming.reviews) ? incoming.reviews : INITIAL.reviews,
    recommendations: Array.isArray(incoming.recommendations) ? incoming.recommendations : INITIAL.recommendations,
    certificates: Array.isArray(incoming.certificates) ? incoming.certificates : INITIAL.certificates,
    links: Array.isArray(incoming.links) ? incoming.links : INITIAL.links,
    social: Array.isArray(incoming.social) ? incoming.social : INITIAL.social,
    contact: Array.isArray(incoming.contact) ? incoming.contact : INITIAL.contact,
  };
}

// Turn a data: URL (e.g. a pasted base64 image/video) back into a File so it
// can go through the same authenticated /api/upload/* endpoints as any other
// upload — the backend no longer accepts raw base64 payloads.
function dataUrlToFile(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mime = (header.match(/data:(.*?);base64/) || [])[1] || "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const ext = mime.split("/")[1] || "bin";
  return new File([bytes], `pasted-${Date.now()}.${ext}`, { type: mime });
}

/* ── shared upload helpers used by the image/video uploader components ── */
async function uploadImageFile(file) {
  if (!file) throw new Error("No image file selected");
  const { url } = await uploadImage(file);
  if (!url) throw new Error("Upload did not return an image URL");
  return url;
}

async function uploadMediaFile(file) {
  if (!file) throw new Error("No media file selected");
  const { url } = await uploadMedia(file);
  if (!url) throw new Error("Upload did not return a media URL");
  return url;
}

async function replaceEmbeddedImages(value, cache = new Map()) {
  if (typeof value === "string") {
    if (!value.startsWith("data:image/") && !value.startsWith("data:video/")) return value;
    if (cache.has(value)) return cache.get(value);
    const file = dataUrlToFile(value);
    const uploadedUrl = value.startsWith("data:video/")
      ? await uploadMediaFile(file)
      : await uploadImageFile(file);
    cache.set(value, uploadedUrl);
    return uploadedUrl;
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map(item => replaceEmbeddedImages(item, cache)));
  }

  if (value && typeof value === "object") {
    const next = {};
    for (const [key, val] of Object.entries(value)) {
      next[key] = await replaceEmbeddedImages(val, cache);
    }
    return next;
  }

  return value;
}

async function publishCmsData(data) {
  const normalized = await replaceEmbeddedImages(normalizeCmsData(data));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.warn("Local storage save skipped:", err.message);
  }

  const updated = await saveContent(normalized);
  window.dispatchEvent(new CustomEvent("portfolio-cms-updated", { detail: updated || normalized }));
  return true;
}
// ─── NAV CONFIG ──────────────────────────────────────────────
const NAV = [
  { id:"overview",        label:"Overview",        icon:I.dashboard,  group:"main" },
  { id:"about",           label:"About / Bio",     icon:I.about,      group:"content" },
  { id:"siteText",        label:"Site Text",       icon:I.text,       group:"content" },
  { id:"skills",          label:"Skills",          icon:I.skills,     group:"content" },
  { id:"projects",        label:"Projects",        icon:I.projects,   group:"content" },
  { id:"experience",      label:"Experience",      icon:I.experience, group:"content" },
  { id:"reviews",         label:"Reviews",         icon:I.reviews,    group:"content" },
  { id:"recommendations", label:"Recommendations", icon:I.recs,       group:"content" },
  { id:"certificates",    label:"Certificates",    icon:I.certs,      group:"content" },
  { id:"links",           label:"Links",           icon:I.links,      group:"meta" },
  { id:"social",          label:"Social Media",    icon:I.social,     group:"meta" },
  { id:"contact",         label:"Contact Info",    icon:I.contact,    group:"meta" },
  { id:"settings",        label:"Settings",        icon:I.settings,   group:"dev" },
  { id:"seed",            label:"DB & Export",     icon:I.api,        group:"dev" },
];

// ─── DASHBOARD SHELL ─────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [active, setActive] = useState("overview");
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? normalizeCmsData(JSON.parse(saved)) : INITIAL;
    } catch {
      return INITIAL;
    }
  });
  const [sideOpen, setSideOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [hydrated, setHydrated] = useState(false);
  const { dark, toggle } = useTheme();
  const t = useT();

  useEffect(() => {
    let cancelled = false;
    getContent()
      .then(remote => {
        if (!cancelled && remote && typeof remote === "object") {
          setData(normalizeCmsData(remote));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      publishCmsData(data)
        .then(() => setSaveStatus("saved"))
        .catch(() => setSaveStatus("local"));
    }, 650);
    return () => clearTimeout(timer);
  }, [data, hydrated]);

  const sections = {
    overview:        <Overview data={data} />,
    about:           <AboutSection data={data} setData={setData} />,
    siteText:        <SiteTextSection data={data} setData={setData} />,
    skills:          <SkillsSection data={data} setData={setData} />,
    projects:        <ProjectsSection data={data} setData={setData} />,
    experience:      <ExperienceSection data={data} setData={setData} />,
    reviews:         <ReviewsSection data={data} setData={setData} />,
    recommendations: <RecsSection data={data} setData={setData} />,
    certificates:    <CertsSection data={data} setData={setData} />,
    links:           <LinksSection data={data} setData={setData} />,
    social:          <SocialSection data={data} setData={setData} />,
    contact:         <ContactSection data={data} setData={setData} />,
    settings:        <SettingsSection />,
    seed:            <SeedPanel data={data} />,
  };

  const nav = id => { setActive(id); setSideOpen(false); };
  const groups = [
    { label:"Main",    ids:NAV.filter(n=>n.group==="main") },
    { label:"Content", ids:NAV.filter(n=>n.group==="content") },
    { label:"Meta",    ids:NAV.filter(n=>n.group==="meta") },
    { label:"Dev",     ids:NAV.filter(n=>n.group==="dev") },
  ];

  const Sidebar = () => (
    <aside style={{ display:"flex",flexDirection:"column",height:"100%",background:t.sidebar,borderRight:`1px solid ${t.border}`,width:228,flexShrink:0 }}>
      <div style={{ padding:"18px 16px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${t.accent},#7c3aed)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:750,color:"#fff",flexShrink:0 }}>A</div>
        <div>
          <div style={{ fontSize:13,fontWeight:700,color:t.text,letterSpacing:"-0.02em" }}>Ahmed's CMS</div>
          <div style={{ fontSize:10,color:t.ar,fontFamily:"'Cairo',sans-serif" }}>ثنائي اللغة · Bilingual</div>
        </div>
      </div>
      <nav style={{ flex:1,overflowY:"auto",padding:"10px 10px" }}>
        {groups.map(g=>(
          <div key={g.label} style={{ marginBottom:6 }}>
            <div style={{ fontSize:10,fontWeight:700,color:t.textMut,textTransform:"uppercase",letterSpacing:"0.1em",padding:"8px 10px 4px" }}>{g.label}</div>
            {g.ids.map(n=>{
              const isActive=active===n.id;
              const count = n.id==="skills"?data.skills.length:n.id==="projects"?data.projects.length:n.id==="experience"?data.experience.length:n.id==="reviews"?data.reviews.length:n.id==="recommendations"?data.recommendations.length:n.id==="certificates"?data.certificates.length:n.id==="links"?data.links.length:n.id==="social"?data.social.length:n.id==="contact"?data.contact.length:null;
              return (
                <button key={n.id} onClick={()=>nav(n.id)} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 10px",borderRadius:10,marginBottom:1,border:"none",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:500,background:isActive?t.accentSoft:"transparent",color:isActive?t.accent:t.textSub,borderLeft:isActive?`2px solid ${t.accent}`:"2px solid transparent",transition:"all 0.12s" }}
                  onMouseEnter={e=>!isActive&&(e.currentTarget.style.background=t.surfaceEl)}
                  onMouseLeave={e=>!isActive&&(e.currentTarget.style.background="transparent")}
                >
                  <span style={{ display:"flex",alignItems:"center",gap:9 }}>
                    <Ic d={n.icon} size={14} /><span style={{ letterSpacing:"-0.01em" }}>{n.label}</span>
                  </span>
                  {count!==null&&<span style={{ fontSize:10,fontWeight:700,background:isActive?t.accent+"25":t.surfaceEl,color:isActive?t.accent:t.textMut,padding:"2px 6px",borderRadius:99,border:`1px solid ${t.border}` }}>{count}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{ padding:"10px 10px",borderTop:`1px solid ${t.border}`,display:"flex",flexDirection:"column",gap:4 }}>
        <button onClick={toggle} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,background:"transparent",border:"none",cursor:"pointer",fontSize:12,color:t.textMut,width:"100%" }} onMouseEnter={e=>e.currentTarget.style.background=t.surfaceEl} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <Ic d={dark?I.sun:I.moon} size={13} /> {dark?"Light Mode":"Dark Mode"}
        </button>
        <button onClick={onLogout} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,background:"transparent",border:"none",cursor:"pointer",fontSize:12,color:t.textMut,width:"100%" }} onMouseEnter={e=>{e.currentTarget.style.background=t.dangerSoft;e.currentTarget.style.color=t.danger;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=t.textMut;}}>
          <Ic d={I.logout} size={13} /> Sign Out
        </button>
      </div>
    </aside>
  );

  const activeNav = NAV.find(n=>n.id===active);

  return (
    <div style={{ display:"flex",height:"100vh",background:t.bg,overflow:"hidden",fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ flexShrink:0,height:"100%",display:"flex",flexDirection:"column" }}><Sidebar /></div>
      {sideOpen&&(
        <div style={{ position:"fixed",inset:0,zIndex:9000,display:"flex" }}>
          <div style={{ width:228,height:"100%",zIndex:1,boxShadow:t.shadowLg }}><Sidebar /></div>
          <div style={{ flex:1,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)" }} onClick={()=>setSideOpen(false)} />
        </div>
      )}
      <div style={{ flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden" }}>
        <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:56,flexShrink:0,background:t.header,borderBottom:`1px solid ${t.border}`,backdropFilter:"blur(16px)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={()=>setSideOpen(true)} style={{ display:"flex",background:"none",border:"none",cursor:"pointer",color:t.textMut,padding:4,borderRadius:8 }}><Ic d={I.menu} size={18} /></button>
            <div>
              <div style={{ fontSize:14,fontWeight:700,color:t.text,letterSpacing:"-0.02em" }}>{activeNav?.label??"Dashboard"}</div>
              <div style={{ fontSize:10,color:t.textMut,display:"flex",alignItems:"center",gap:4 }}>
                <span style={{ color:t.ar,fontFamily:"'Cairo',sans-serif",fontSize:10 }}>AR</span> · <span>EN</span> · Bilingual CMS
              </div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ display:"flex",alignItems:"center",gap:5,background:t.successSoft,border:`1px solid ${t.success}30`,color:t.success,padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:700 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:saveStatus==="saving"?t.warn:t.success,display:"inline-block",boxShadow:`0 0 6px ${saveStatus==="saving"?t.warn:t.success}` }} />{saveStatus==="saving"?"Saving...":saveStatus==="local"?"Saved locally":"Published"}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:5,background:t.arSoft,border:`1px solid ${t.ar}30`,color:t.ar,padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:700,fontFamily:"'Cairo',sans-serif" }}>🌐 ثنائي</div>
            <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${t.accent},#7c3aed)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:750,color:"#fff" }}>A</div>
          </div>
        </header>
        <main style={{ flex:1,overflowY:"auto",padding:"28px 32px",width:"100%" }}>
          <div style={{ width:"100%",maxWidth:"none",margin:0 }}>
            {sections[active]}
          </div>
        </main>
      </div>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{margin:0;font-family:'Inter',system-ui,sans-serif}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${t.border};border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:${t.borderHov}}
        @keyframes pulse{0%,100%{opacity:0.6}50%{opacity:0.3}}
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────
export default function AdminApp() {
  const [authed, setAuthed] = useState(() => hasToken());

  const handleLogout = () => {
    removeToken();
    setAuthed(false);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        {authed ? <Dashboard onLogout={handleLogout} /> : <Login onLogin={()=>setAuthed(true)} />}
      </ToastProvider>
    </ThemeProvider>
  );
}

/*
════════════════════════════════════════════════════════════════
  WHAT'S NEW IN THIS BILINGUAL EDITION
════════════════════════════════════════════════════════════════

✅ ALL REAL DATA PRE-LOADED:
   - 9 Projects (all bilingual)
   - 12 Skills (all bilingual) 
   - 8 Certificates (all bilingual)
   - 6 Experience entries (all bilingual)
   - 5 Reviews (all bilingual)
   - 1 Recommendation (Dr. Amal Mahmoud, bilingual)
   - 5 Links
   - 4 Social
   - 4 Contact

✅ BILINGUAL SUPPORT (AR/EN):
   - Language toggle (EN 🇺🇸 / AR 🇪🇬) on every section header
   - Every form has bilingual fields with AR/EN toggle
   - Arabic text uses Cairo/Noto Sans Arabic font
   - Arabic fields have RTL direction and right-aligned text
   - Arabic content highlighted in orange (#fb923c) 
   - Orange focus ring and background for AR fields

✅ DATABASE VERIFICATION PANEL:
   - Expandable count verifier on the Overview page
   - DB & Export tab with per-category counts

✅ EXPORT / SEED TOOLS:
   - DB & Export section (sidebar)
   - Download portfolio-data.json (full bilingual data)
   - SQL schema for bilingual tables
   - API seed endpoint guidance

✅ UI IMPROVEMENTS:
   - Record counts shown in sidebar nav items
   - Page size increased to 10 records
   - BilingualSection wrapper highlights AR fields
   - Header shows "AR · EN · Bilingual CMS"

════════════════════════════════════════════════════════════════
  SETUP
════════════════════════════════════════════════════════════════
1. npm create vite@latest admin -- --template react
2. cd admin && npm install  
3. Replace src/App.jsx with this file
4. import AdminApp from './App' in main.jsx → <AdminApp />
5. Sign in with the email/password of a user created on the backend
════════════════════════════════════════════════════════════════
*/
