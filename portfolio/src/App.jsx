import { useState, useEffect } from 'react';
import { LangProvider } from './context/LangContext';
import { CmsProvider, useCms } from './context/CmsContext';

import SkeletonPage from './components/SkeletonPage';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Certificates from './sections/Certificates';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

function PortfolioContent({ darkMode, toggleDarkMode }) {
  const { loading } = useCms();

  if (loading) {
    return <SkeletonPage />;
  }

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Certificates />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(d => !d);

  return (
    <CmsProvider>
      <LangProvider>
        <PortfolioContent
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </LangProvider>
    </CmsProvider>
  );
}