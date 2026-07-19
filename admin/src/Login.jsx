/**
 * ============================================================
 *  Login — email + password sign-in against the real backend
 *  Styling matches the Admin Dashboard (same theme tokens,
 *  icon set, and form controls).
 * ============================================================
 */

import { useState } from "react";
import { useTheme, useT, Ic, I, Input } from "./theme.jsx";
import { login, saveToken } from "./api.js";

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const { dark, toggle } = useTheme();
  const t = useT();

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await login(email, password);
      if (!token) throw new Error("Login did not return a token");
      saveToken(token);
      onLogin();
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'Inter',system-ui,sans-serif" }}>
      {/* glow */}
      <div style={{ position:"fixed",top:-100,left:"50%",transform:"translateX(-50%)",width:600,height:400,borderRadius:"50%",background:`radial-gradient(ellipse,${t.accentGl} 0%,transparent 70%)`,pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:420, position:"relative" }}>
        {/* top-right: theme toggle */}
        <button onClick={toggle} style={{ position:"absolute",top:-48,right:0,background:t.surface,border:`1px solid ${t.border}`,borderRadius:99,padding:"6px 12px",cursor:"pointer",color:t.textSub,fontSize:12,display:"flex",alignItems:"center",gap:6 }}>
          <Ic d={dark?I.sun:I.moon} size={13}/> {dark?"Light":"Dark"}
        </button>

        {/* logo + title */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:60,height:60,borderRadius:20,background:`linear-gradient(135deg,${t.accent},#a78bfa)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:750,color:"#fff",margin:"0 auto 14px",boxShadow:`0 8px 24px ${t.accent}50` }}>A</div>
          <h1 style={{ fontSize:22,fontWeight:750,color:t.text,letterSpacing:"-0.03em",margin:"0 0 4px" }}>Portfolio CMS</h1>
          <p style={{ fontSize:13,color:t.textMut,margin:"0 0 2px",fontFamily:"'Cairo',sans-serif" }}>لوحة تحكم ثنائية اللغة</p>
          <p style={{ fontSize:11,color:t.textMut,opacity:0.65 }}>Bilingual AR/EN Admin Dashboard</p>
        </div>

        {/* card */}
        <div style={{ background:t.surface,border:`1px solid ${t.border}`,borderRadius:20,padding:28,boxShadow:t.shadowLg }}>
          <form onSubmit={handleLogin} style={{ display:"flex",flexDirection:"column",gap:16 }}>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e=>{setEmail(e.target.value);setError("");}}
              autoFocus
              autoComplete="username"
              required
            />

            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              <label style={{ fontSize:11,fontWeight:700,color:t.textMut,textTransform:"uppercase",letterSpacing:"0.08em" }}>Password</label>
              <div style={{ position:"relative" }}>
                <Input
                  type={showPw?"text":"password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e=>{setPassword(e.target.value);setError("");}}
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={()=>setShowPw(s=>!s)}
                  style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:t.textMut,display:"flex",alignItems:"center",padding:4 }}>
                  <Ic d={showPw?["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94","M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19","M1 1l22 22","M14.12 14.12a3 3 0 11-4.24-4.24"]:I.eye} size={15}/>
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display:"flex",alignItems:"center",gap:7,background:t.dangerSoft,border:`1px solid ${t.danger}30`,borderRadius:9,padding:"9px 12px",fontSize:12,color:t.danger,fontWeight:500 }}>
                <Ic d={I.warn} size={13}/> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width:"100%",padding:"12px",borderRadius:12,background:`linear-gradient(135deg,${t.accent},#7c3aed)`,color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:loading?"wait":"pointer",opacity:loading?0.75:1,boxShadow:`0 4px 16px ${t.accent}40`,transition:"all 0.2s",marginTop:2 }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} body{margin:0}`}</style>
    </div>
  );
}
