import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Contact from '../components/Contact'
import LayoutSwitcher from '../components/layout/LayoutSwitcher';
import { useLayout } from '../contexts/LayoutContext';

const pageConfig = {
  classic: { pageClass: 'min-h-screen bg-slate-900 text-slate-50', bodyBg: '#0f172a' },
  terminal: { pageClass: 'min-h-screen bg-slate-950 text-green-400 font-mono', bodyBg: '#020617' },
  neon: { pageClass: 'min-h-screen bg-slate-900 text-slate-50', bodyBg: '#0f172a' },
  '90s': { pageClass: 'min-h-screen bg-[#1a0a2e] text-yellow-300 font-mono', bodyBg: '#1a0a2e' },
};

const Dashboard = () => {
  const { layout } = useLayout();
  const config = pageConfig[layout] || pageConfig.classic;

  useEffect(() => {
    document.body.style.backgroundColor = config.bodyBg;
    return () => { document.body.style.backgroundColor = ''; };
  }, [config.bodyBg]);

  return (
    <div className={`${config.pageClass} relative`}>
      <Navigation />
      <HeroSection />
      <Experience />
      <Projects />
      <Blog />
      <Contact />
      <LayoutSwitcher />
    </div>
  );
};

export default Dashboard;
