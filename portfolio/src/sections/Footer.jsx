import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Heart } from 'lucide-react';
import { useLang } from '../context/LangContext';

const socials = [
  { icon: Github,       href: 'https://github.com/ahmedaymansoliman2004',         label: 'GitHub' },
  { icon: Linkedin,     href: 'https://www.linkedin.com/in/ahmed-ayman-soliman',  label: 'LinkedIn' },
  { icon: ExternalLink, href: 'https://www.kaggle.com/sohagy1312',                label: 'Kaggle' },
  { icon: Mail,         href: 'mailto:ahmedayman.soliman27@gmail.com',            label: 'Email' },
];

export default function Footer() {
  const { t } = useLang();

  const navLinks = [
    { label: t.nav.about,        href: '#about' },
    { label: t.nav.projects,     href: '#projects' },
    { label: t.nav.experience,   href: '#experience' },
    { label: t.nav.certificates, href: '#certificates' },
    { label: t.nav.testimonials, href: '#testimonials' },
    { label: t.nav.contact,      href: '#contact' },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-[#080C16] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
                <span className="font-display font-bold text-sm text-accent">AS</span>
              </div>
              <span className="font-display font-semibold text-gray-800 dark:text-white">Ahmed Ayman Soliman</span>
            </div>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-600">{t.footer.role}</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-xs text-gray-500 dark:text-gray-500 hover:text-accent transition-colors font-body">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/8 flex items-center justify-center text-gray-500 dark:text-gray-500 hover:bg-accent/15 hover:text-accent transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
            © {new Date().getFullYear()} Ahmed Ayman Soliman. {t.footer.rights}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
            {t.footer.builtWith} <Heart size={10} className="text-red-400 fill-red-400 mx-1" /> React, Tailwind &amp; Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
