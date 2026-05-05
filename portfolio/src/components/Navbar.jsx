import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { t, lang, toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('home');

  const navLinks = useMemo(() => ([
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.experience, href: '#experience' },
    { label: t.nav.certificates, href: '#certificates' },
    { label: t.nav.testimonials, href: '#testimonials' },
    { label: t.nav.contact, href: '#contact' },
  ]), [t]);

  const getSectionOffset = useCallback(() => {
    return window.innerWidth < 768 ? 92 : 88;
  }, []);

  const getSectionIds = useCallback(() => {
    return navLinks.map(link => link.href.slice(1));
  }, [navLinks]);

  const updateActiveSection = useCallback(() => {
    const sectionIds = getSectionIds();
    const offset = getSectionOffset();
    const scrollPosition = window.scrollY + offset + 8;
    const pageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

    if (pageBottom) {
      setActive(sectionIds[sectionIds.length - 1] || 'contact');
      return;
    }

    let current = sectionIds[0] || 'home';

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (!section) continue;

      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop) {
        current = id;
      }
    }

    setActive(current);
  }, [getSectionIds, getSectionOffset]);

  const handleNavClick = useCallback((href) => {
    const id = href.slice(1);
    const section = document.getElementById(id);

    if (!section) return;

    setActive(id);
    setMobileOpen(false);

    const top = Math.max(0, section.offsetTop - getSectionOffset());

    window.scrollTo({
      top,
      behavior: 'smooth',
    });

    window.history.replaceState(null, '', href);
  }, [getSectionOffset]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [updateActiveSection, lang]);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    window.setTimeout(() => {
      const section = document.getElementById(hash.slice(1));
      if (!section) return;
      setActive(hash.slice(1));
      window.scrollTo({ top: Math.max(0, section.offsetTop - getSectionOffset()) });
    }, 80);
  }, [getSectionOffset]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#0A0E1A]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <span className="font-display font-bold text-sm text-accent">AS</span>
              </div>
              <span className="font-display font-semibold text-sm hidden sm:block text-gray-800 dark:text-white">
                Ahmed Soliman
              </span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const id = link.href.slice(1);

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`relative px-3 py-1.5 text-sm font-body font-medium transition-colors rounded-lg ${
                      active === id
                        ? 'text-accent'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                    {active === id && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-accent/10 rounded-lg -z-10"
                      />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="h-8 px-3 rounded-lg flex items-center justify-center text-xs font-mono font-bold border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-400 hover:border-accent hover:text-accent transition-all"
                aria-label="Toggle language"
              >
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>

              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="hidden sm:flex btn-primary text-xs px-4 py-2"
              >
                {t.nav.hire}
              </a>

              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-[#0D1220] border-b border-gray-200 dark:border-white/10 shadow-xl md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => {
                const id = link.href.slice(1);

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active === id
                        ? 'text-accent bg-accent/10'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-accent'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
