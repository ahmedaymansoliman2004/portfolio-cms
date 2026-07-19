/**
 * ============================================================
 *  Shared theme / design-system primitives
 *  Theme + Toast context, icon set, design tokens, and the
 *  base form controls used by both the Login screen and the
 *  Admin Dashboard, so both stay perfectly in sync.
 * ============================================================
 */

import { useState, useContext, createContext, useCallback } from "react";

// ─── THEME CONTEXT ────────────────────────────────────────────
export const ThemeCtx = createContext({ dark: true, toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

// ─── TOAST CONTEXT ────────────────────────────────────────────
export const ToastCtx = createContext({ toast: () => {} });
export const useToast = () => useContext(ToastCtx);

// ─── ICON PRIMITIVES ─────────────────────────────────────────
export const Ic = ({ d, size = 16, className = "", strokeWidth = 1.75, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
    strokeLinejoin="round" className={className} style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

export const I = {
  dashboard:  "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  about:      ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  skills:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  projects:   ["M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z","M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"],
  experience: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  reviews:    "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  recs:       ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75","M9 11a4 4 0 100-8 4 4 0 000 8z"],
  certs:      ["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"],
  links:      ["M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71","M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"],
  social:     ["M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"],
  contact:    ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  api:        ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  logout:     ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  plus:       ["M12 5v14","M5 12h14"],
  edit:       ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  trash:      ["M3 6h18","M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"],
  save:       ["M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z","M17 21v-8H7v8","M7 3v5h8"],
  close:      ["M18 6L6 18","M6 6l12 12"],
  eye:        ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  star:       "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  menu:       ["M3 12h18","M3 6h18","M3 18h18"],
  check:      "M20 6L9 17l-5-5",
  warn:       ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  sun:        ["M12 1v2","M12 21v2","M4.22 4.22l1.42 1.42","M18.36 18.36l1.42 1.42","M1 12h2","M21 12h2","M4.22 19.78l1.42-1.42","M18.36 5.64l1.42-1.42","M12 6a6 6 0 010 12A6 6 0 0112 6z"],
  moon:       "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  search:     ["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"],
  externalLink: ["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6","M15 3h6v6","M10 14L21 3"],
  globe:      ["M12 2a10 10 0 100 20A10 10 0 0012 2z","M2 12h20","M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"],
  lang:       ["M5 8l4 4-4 4","M19 8l-4 4 4 4","M12 3v18"],
  info:       ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 8v4","M12 16h.01"],
  upload:     ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  image:      ["M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z","M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z","M21 15l-5-5L5 21"],
  arrowUp:    ["M12 19V5","M5 12l7-7 7 7"],
  arrowDown:  ["M12 5v14","M19 12l-7 7-7-7"],
  settings:   ["M12 15.5A3.5 3.5 0 1012 8a3.5 3.5 0 000 7.5z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.31.48.6 1.51.6H21a2 2 0 010 4h-.09A1.65 1.65 0 0019.4 15z"],
  text:       ["M4 7h16","M4 12h16","M4 17h10"],
  xCircle:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M15 9l-6 6","M9 9l6 6"],
};

// ─── DESIGN TOKENS ───────────────────────────────────────────
export const tokens = {
  dark: {
    bg:"#0a0a0f", surface:"#111118", surfaceEl:"#18181f",
    border:"rgba(255,255,255,0.07)", borderHov:"rgba(255,255,255,0.14)",
    text:"#f0f0f5", textMut:"#71717a", textSub:"#a1a1aa",
    accent:"#818cf8", accentGl:"rgba(129,140,248,0.15)", accentSoft:"rgba(129,140,248,0.08)",
    ar:"#fb923c", arSoft:"rgba(251,146,60,0.1)", arGl:"rgba(251,146,60,0.15)",
    danger:"#f87171", dangerSoft:"rgba(248,113,113,0.08)",
    success:"#34d399", successSoft:"rgba(52,211,153,0.1)",
    warn:"#fbbf24", warnSoft:"rgba(251,191,36,0.1)",
    sidebar:"#0d0d14", header:"rgba(10,10,15,0.85)",
    shadow:"0 4px 24px rgba(0,0,0,0.5)", shadowLg:"0 12px 48px rgba(0,0,0,0.7)",
    glass:"rgba(255,255,255,0.03)",
    pill:{
      ml:{bg:"rgba(129,140,248,0.12)",text:"#a5b4fc"},
      dev:{bg:"rgba(52,211,153,0.12)",text:"#6ee7b7"},
      ana:{bg:"rgba(251,191,36,0.12)",text:"#fcd34d"},
      cv:{bg:"rgba(251,113,133,0.12)",text:"#fda4af"},
      data:{bg:"rgba(56,189,248,0.12)",text:"#7dd3fc"},
      work:{bg:"rgba(167,139,250,0.12)",text:"#c4b5fd"},
      edu:{bg:"rgba(56,189,248,0.12)",text:"#7dd3fc"},
      cert:{bg:"rgba(52,211,153,0.12)",text:"#6ee7b7"},
      other:{bg:"rgba(161,161,170,0.12)",text:"#a1a1aa"},
    },
  },
  light: {
    bg:"#f5f5f9", surface:"#ffffff", surfaceEl:"#f8f8fc",
    border:"rgba(0,0,0,0.07)", borderHov:"rgba(0,0,0,0.14)",
    text:"#111118", textMut:"#71717a", textSub:"#52525b",
    accent:"#6366f1", accentGl:"rgba(99,102,241,0.12)", accentSoft:"rgba(99,102,241,0.06)",
    ar:"#ea580c", arSoft:"rgba(234,88,12,0.08)", arGl:"rgba(234,88,12,0.12)",
    danger:"#ef4444", dangerSoft:"rgba(239,68,68,0.06)",
    success:"#10b981", successSoft:"rgba(16,185,129,0.08)",
    warn:"#f59e0b", warnSoft:"rgba(245,158,11,0.08)",
    sidebar:"#ffffff", header:"rgba(255,255,255,0.9)",
    shadow:"0 2px 16px rgba(0,0,0,0.08)", shadowLg:"0 8px 40px rgba(0,0,0,0.12)",
    glass:"rgba(0,0,0,0.02)",
    pill:{
      ml:{bg:"rgba(99,102,241,0.1)",text:"#4f46e5"},
      dev:{bg:"rgba(16,185,129,0.1)",text:"#059669"},
      ana:{bg:"rgba(245,158,11,0.1)",text:"#b45309"},
      cv:{bg:"rgba(239,68,68,0.1)",text:"#dc2626"},
      data:{bg:"rgba(14,165,233,0.1)",text:"#0284c7"},
      work:{bg:"rgba(139,92,246,0.1)",text:"#7c3aed"},
      edu:{bg:"rgba(14,165,233,0.1)",text:"#0284c7"},
      cert:{bg:"rgba(16,185,129,0.1)",text:"#059669"},
      other:{bg:"rgba(113,113,122,0.1)",text:"#52525b"},
    },
  },
};

export function useT() { const { dark } = useTheme(); return dark ? tokens.dark : tokens.light; }

// ─── TOAST ───────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, msg, type }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3500);
  }, []);
  const t = useT();
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
        {toasts.map(toast => {
          const isErr = toast.type==="error"; const isWarn = toast.type==="warn";
          const bg = isErr ? t.danger : isWarn ? t.warn : t.success;
          return (
            <div key={toast.id} style={{
              background:t.surface, border:`1px solid ${bg}30`, borderLeft:`3px solid ${bg}`,
              borderRadius:10, padding:"12px 16px", boxShadow:t.shadowLg,
              color:t.text, fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:8,
              maxWidth:340, animation:"slideIn 0.25s ease",
            }}>
              <span style={{ color:bg, fontSize:16 }}>{isErr?"✕":isWarn?"⚠":"✓"}</span>
              {toast.msg}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </ToastCtx.Provider>
  );
}

// ─── BUTTON ──────────────────────────────────────────────────
export function Btn({ children, onClick, variant="primary", type="button", disabled, size="md" }) {
  const t = useT();
  const [hov, setHov] = useState(false);
  const styles = {
    primary:{ background:hov?"#6d73f5":t.accent, color:"#fff", border:`1px solid transparent`, boxShadow:hov?`0 0 20px ${t.accent}50`:"none" },
    secondary:{ background:hov?t.surfaceEl:"transparent", color:t.textSub, border:`1px solid ${t.border}` },
    danger:{ background:hov?t.danger:t.dangerSoft, color:hov?"#fff":t.danger, border:`1px solid ${t.danger}40` },
    ghost:{ background:hov?t.surfaceEl:"transparent", color:hov?t.text:t.textMut, border:"1px solid transparent" },
    success:{ background:hov?t.success:t.successSoft, color:hov?"#fff":t.success, border:`1px solid ${t.success}40` },
  }[variant]||{};
  const pad = size==="sm"?"5px 10px":"8px 14px";
  const fs = size==="sm"?12:13;
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"inline-flex",alignItems:"center",gap:6,padding:pad,borderRadius:9,fontSize:fs,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,transition:"all 0.15s",...styles }}>
      {children}
    </button>
  );
}

// ─── FORM FIELDS ─────────────────────────────────────────────
export function Field({ label, hint, children }) {
  const t = useT();
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {label && <label style={{ fontSize:11, fontWeight:700, color:t.textMut, textTransform:"uppercase", letterSpacing:"0.08em" }}>
        {label}{hint&&<span style={{ fontWeight:400, textTransform:"none", letterSpacing:"normal", marginLeft:6, color:t.textMut, opacity:0.7 }}>{hint}</span>}
      </label>}
      {children}
    </div>
  );
}

export function inputStyle(t, focused, isAr=false) {
  return {
    background: focused ? t.surfaceEl : t.glass,
    border: `1px solid ${focused ? (isAr?t.ar:t.accent) : t.border}`,
    borderRadius:10, padding:"10px 12px", fontSize:13, color:t.text,
    outline:"none", width:"100%", boxSizing:"border-box", transition:"all 0.15s",
    boxShadow: focused ? `0 0 0 3px ${isAr?t.arSoft:t.accentSoft}` : "none",
    fontFamily: isAr ? "'Cairo', 'Noto Sans Arabic', sans-serif" : "inherit",
    direction: isAr ? "rtl" : "ltr", textAlign: isAr ? "right" : "left",
  };
}

export function Input({ label, hint, isAr, ...props }) {
  const t = useT();
  const [foc, setFoc] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <input style={inputStyle(t, foc, isAr)} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} {...props} />
    </Field>
  );
}

// ─── THEME PROVIDER ──────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  return <ThemeCtx.Provider value={{ dark, toggle:()=>setDark(d=>!d) }}>{children}</ThemeCtx.Provider>;
}
