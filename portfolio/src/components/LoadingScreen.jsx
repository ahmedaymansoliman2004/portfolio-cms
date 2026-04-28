import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';

/* ─── Arabic Loading Screen ─────────────────────────────────────── */
function ArabicLoader({ progress }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-8" dir="rtl">
      {/* Decorative corner lines — top */}
      <div className="absolute top-16 right-16 w-16 h-16 border-t-2 border-r-2 border-accent/30 rounded-tr-xl hidden sm:block" />
      <div className="absolute top-16 left-16 w-16 h-16 border-t-2 border-l-2 border-accent/10 rounded-tl-xl hidden sm:block" />

      {/* Logo badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-2xl border-2 border-accent/40 flex items-center justify-center bg-accent/8 glow">
          <span
            className="font-bold text-3xl text-accent"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            أس
          </span>
        </div>
        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
        </motion.div>
      </motion.div>

      {/* Name + subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-center"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <p className="font-bold text-white text-2xl leading-tight mb-1">
          أحمد أيمن سليمان
        </p>
        <p className="text-sm text-accent/70 mt-1">
          مهندس ذكاء اصطناعي · مهندس بيانات
        </p>
        <p className="text-xs text-gray-600 mt-2 tracking-wide">
          جامعة MSA · الجيزة، مصر
        </p>
      </motion.div>

      {/* Animated Arabic script decoration */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="h-px w-12 bg-gradient-to-l from-accent/60 to-transparent" />
        <span className="text-accent/40 text-xs font-mono tracking-widest">◈</span>
        <div className="h-px w-12 bg-gradient-to-r from-accent/60 to-transparent" />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-56 flex flex-col items-center gap-3"
      >
        <div className="w-full h-0.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-accent to-accent/60 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p
          className="text-xs text-gray-600 tabular-nums"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {progress < 100 ? `جاري التحميل... ${progress}٪` : 'مرحباً بك ✦'}
        </p>
      </motion.div>

      {/* Decorative corner lines — bottom */}
      <div className="absolute bottom-16 right-16 w-16 h-16 border-b-2 border-r-2 border-accent/10 rounded-br-xl hidden sm:block" />
      <div className="absolute bottom-16 left-16 w-16 h-16 border-b-2 border-l-2 border-accent/30 rounded-bl-xl hidden sm:block" />
    </div>
  );
}

/* ─── English Loading Screen ────────────────────────────────────── */
function EnglishLoader({ progress }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-8" dir="ltr">
      {/* Top left corner */}
      <div className="absolute top-16 left-16 w-16 h-16 border-t-2 border-l-2 border-accent/30 rounded-tl-xl hidden sm:block" />
      <div className="absolute top-16 right-16 w-16 h-16 border-t-2 border-r-2 border-accent/10 rounded-tr-xl hidden sm:block" />

      {/* Logo badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: 10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-2xl border-2 border-accent/40 flex items-center justify-center bg-accent/8 glow">
          <span
            className="font-bold text-3xl text-accent"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            AS
          </span>
        </div>
        {/* Orbiting dot — opposite direction */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
        </motion.div>
      </motion.div>

      {/* Name + subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-center"
      >
        <p
          className="font-bold text-white text-2xl leading-tight mb-1 tracking-wide uppercase"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Ahmed Ayman
        </p>
        <p className="text-sm text-accent/70 mt-1 font-mono tracking-widest">
          AI ENGINEER · DATA ENGINEER
        </p>
        <p className="text-xs text-gray-600 mt-2 font-mono tracking-wider">
          MSA University · Giza, Egypt
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="h-px w-12 bg-gradient-to-r from-accent/60 to-transparent" />
        <span className="text-accent/40 text-xs font-mono tracking-widest">◈</span>
        <div className="h-px w-12 bg-gradient-to-l from-accent/60 to-transparent" />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-56 flex flex-col items-center gap-3"
      >
        <div className="w-full h-0.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-xs text-gray-600 font-mono tabular-nums">
          {progress < 100 ? `Loading... ${progress}%` : 'Welcome ✦'}
        </p>
      </motion.div>

      {/* Bottom corners */}
      <div className="absolute bottom-16 left-16 w-16 h-16 border-b-2 border-l-2 border-accent/10 rounded-bl-xl hidden sm:block" />
      <div className="absolute bottom-16 right-16 w-16 h-16 border-b-2 border-r-2 border-accent/30 rounded-br-xl hidden sm:block" />
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */
export default function LoadingScreen({ onFinish }) {
  const { lang } = useLang();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(onFinish, 400);
            return 100;
          }
          return prev + 3;
        });
      }, 28);
    }, 300);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#0A0E1A] flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Ambient background glow — accent color for AR, blue-ish for EN */}
      <div className="absolute inset-0 overflow-hidden">
        {lang === 'ar' ? (
          <>
            <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[80px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/4 blur-[60px] animate-float" />
          </>
        ) : (
          <>
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[80px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-500/4 blur-[60px] animate-float" />
          </>
        )}
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,229,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <AnimatePresence mode="wait">
        {lang === 'ar' ? (
          <motion.div
            key="ar-loader"
            className="relative w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArabicLoader progress={progress} />
          </motion.div>
        ) : (
          <motion.div
            key="en-loader"
            className="relative w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EnglishLoader progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
