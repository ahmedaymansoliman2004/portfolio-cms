import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, ExternalLink, Send, MapPin, Phone } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.open(`mailto:ahmedayman.soliman27@gmail.com?subject=${subject}&body=${body}`);
    setStatus('opened');
    setForm({ name: '', email: '', message: '' });
  };

  const socials = [
    { icon: Mail,         label: 'Email',    value: 'ahmedayman.soliman27@gmail.com', href: 'mailto:ahmedayman.soliman27@gmail.com' },
    { icon: Github,       label: 'GitHub',   value: 'ahmedaymansoliman2004',          href: 'https://github.com/ahmedaymansoliman2004' },
    { icon: Linkedin,     label: 'LinkedIn', value: 'ahmed-ayman-soliman',            href: 'https://www.linkedin.com/in/ahmed-ayman-soliman' },
    { icon: ExternalLink, label: 'Kaggle',   value: 'sohagy1312',                    href: 'https://www.kaggle.com/sohagy1312' },
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 dark:opacity-100 opacity-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">{t.contact.label}</p>
          <h2 className="section-heading text-gray-900 dark:text-white mb-4">{t.contact.title}</h2>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">{t.contact.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-6 w-full"
          >
            <div className="card-glass p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-600">{t.contact.location}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t.contact.locationValue}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-600">{t.contact.phone}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" dir="ltr">+201555364886</p>
                </div>
              </div>
            </div>

            <div className="card-glass p-6 flex flex-col gap-4">
              <p className="text-xs font-mono text-gray-400 dark:text-gray-600 uppercase tracking-widest">{t.contact.socialLinks}</p>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/8 flex items-center justify-center group-hover:bg-accent/15 transition-colors flex-shrink-0">
                    <s.icon size={14} className="text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-gray-400 dark:text-gray-600">{s.label}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors truncate" dir="ltr">
                      {s.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 w-full"
          >
            <form onSubmit={handleSubmit} className="card-glass p-6 sm:p-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-gray-500 dark:text-gray-500 uppercase tracking-wider block mb-2">{t.contact.name}</label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder={t.contact.namePlaceholder}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-500 dark:text-gray-500 uppercase tracking-wider block mb-2">{t.contact.email}</label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder={t.contact.emailPlaceholder}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-gray-500 dark:text-gray-500 uppercase tracking-wider block mb-2">{t.contact.message}</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required rows={5}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors resize-none"
                />
              </div>

              {status === 'opened' && (
                <p className="text-xs text-green-500 font-mono">{t.contact.sent}</p>
              )}

              <button type="submit" className="btn-primary ms-auto justify-center w-full sm:w-auto">
                <Send size={14} />
                {t.contact.send}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
