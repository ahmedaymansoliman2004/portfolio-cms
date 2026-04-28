import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import profileImg from '../assets/profile.jpg';
import { useLang } from '../context/LangContext';

const skillsLabel = { ar: 'المهارات', en: 'SKILLS' };
const SKILLS = ['Python', 'TensorFlow', 'YOLOv8', 'SQL', 'Power BI', 'Scikit-learn', 'OpenCV', 'Flask'];

export default function Hero() {
  const { t, lang } = useLang();

  const nameDisplay = lang === 'ar'
    ? { line1: 'أحمد', line2: 'أيمن', line3: 'سليمان' }
    : { line1: 'Ahmed', line2: 'Ayman', line3: 'Soliman' };

  /*
   * LAYOUT RULES (desktop):
   *   Arabic  → text RIGHT  | image LEFT   (row-reverse because RTL reads right→left)
   *   English → text LEFT   | image RIGHT  (normal row)
   *
   * In the DOM the Text block comes first, then the Image block.
   * - Arabic  (isRTL=true):  flex-row        → text appears on the LEFT in DOM order,
   *                            but because dir=rtl the visual start is the RIGHT side.
   *                            So text is visually RIGHT, image is visually LEFT. ✓
   * - English (isRTL=false): flex-row        → text LEFT, image RIGHT. ✓
   *
   * We do NOT reverse on mobile (stacked column) – image always comes below text.
   */

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 mesh-bg light-mesh-bg" />
      <div className="absolute inset-0 dark:opacity-100 opacity-0 transition-opacity duration-300">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/6 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">

        {/*
          ── Main hero row ──
          Both AR and EN use `flex-row` at lg breakpoint.
          Because dir=rtl is set on <html> for Arabic, the browser automatically
          places the first child (Text) on the RIGHT and the second child (Image) on the LEFT.
          For English (dir=ltr) the first child (Text) is on the LEFT and Image on the RIGHT.
          This gives us exactly the desired layout without any flex-row-reverse needed.
        */}
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* ── TEXT BLOCK (DOM first → visual RIGHT in AR, visual LEFT in EN) ── */}
          <motion.div
            key={`text-${lang}`}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 flex flex-col items-center lg:items-start"
          >
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-mono mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              {t.hero.available}
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.7 }}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-white leading-[1.18] mb-5 tracking-tight rtl:[letter-spacing:0]"
            >
              {nameDisplay.line1}
              <br />
              <span className="text-accent glow-text">{nameDisplay.line2}</span>
              <br />
              {nameDisplay.line3}
            </motion.h1>

            {/* Role subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-sm text-accent mb-5 font-mono ltr:tracking-widest ltr:uppercase"
            >
              {t.hero.role}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.6 }}
              className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg mb-9 text-start"
            >
              {t.hero.description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.53, duration: 0.5 }}
              className={`flex flex-wrap items-center gap-3 justify-center mb-10 lg:justify-normal`}
            >
              <a href="#projects" className="btn-primary">
                {t.hero.viewProjects}
                <ArrowDown size={14} className="animate-bounce" />
              </a>
              <a href="#contact" className="btn-outline">
                <Mail size={14} />
                {t.hero.contactMe}
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.63 }}
              className={`flex items-center gap-5 justify-center lg:justify-normal`}
            >
              {[
                { icon: Github,       href: 'https://github.com/ahmedaymansoliman2004',        label: 'GitHub' },
                { icon: Linkedin,     href: 'https://www.linkedin.com/in/ahmed-ayman-soliman', label: 'LinkedIn' },
                { icon: ExternalLink, href: 'https://www.kaggle.com/sohagy1312',               label: 'Kaggle' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500 hover:text-accent transition-colors"
                >
                  <Icon size={16} />
                  <span className="text-xs">{label}</span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── IMAGE BLOCK (DOM second → visual LEFT in AR, visual RIGHT in EN) ── */}
          <motion.div
            key={`image-${lang}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: 'easeOut' }}
            className="relative flex-shrink-0 order-first lg:order-none"
          >
            {/* Glow halo */}
            <div className="absolute inset-0 rounded-3xl bg-accent/10 blur-2xl scale-110 animate-pulse-slow" />

            {/* Photo frame */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-accent/30 glow">
              <img
                src={profileImg}
                alt="Ahmed Ayman Soliman"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent" />
            </div>

            {/*
              Floating badges:
              Arabic  → GPA badge is on the INNER side (left of image = toward text)
                         Projects badge is on the OUTER side (right of image)
              English → GPA badge is on the INNER side (right of image = toward text)
                         Projects badge is on the OUTER side (left of image)
            */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 card-glass px-4 py-3 rounded-xl shadow-xl z-10"
              style={{ insetInlineEnd: '-1.5rem' }}
            >
              <p className="font-display font-bold text-lg text-accent leading-none">3.63</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-0.5">{t.hero.gpa} / 4.0</p>
            </motion.div>

            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 card-glass px-4 py-3 rounded-xl shadow-xl z-10"
              style={{ insetInlineStart: '-1.5rem' }}
            >
              <p className="font-display font-bold text-lg text-accent leading-none">9+</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-0.5">{t.hero.projects}</p>
            </motion.div>
          </motion.div>

        </div>

        {/* ── Skills bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82 }}
          className="mt-24 flex flex-wrap items-center justify-center gap-2"
          /*
           * The label is first in DOM order. In a flex container:
           * - LTR (dir=ltr): first DOM child → visually leftmost ✓
           * - RTL (dir=rtl): first DOM child → visually rightmost ✓
           * No reordering needed — the browser handles it via dir attribute.
           */
        >
          <span className="text-xs font-mono text-gray-400 dark:text-gray-600 mx-2 flex-shrink-0">
            {skillsLabel[lang]}:
          </span>
          {SKILLS.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.82 + i * 0.05 }}
              className="tech-tag"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 dark:text-gray-600"
      >
        <ArrowDown size={18} />
      </motion.div>
    </section>
  );
}
