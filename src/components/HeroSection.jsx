import React, { useState, useEffect } from 'react';
import Button from "../components/common/Button"
import { useLayout } from '../contexts/LayoutContext';

const HeroSection = () => {
  const { layout } = useLayout();
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = [
    'Crafting Full Stack Solutions with AI'
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex];
      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
      }
      if (!isDeleting && currentText === current) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((currentIndex + 1) % texts.length);
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isDark = layout === 'neon' || layout === '90s';

  const textContent = (
    <div className={`flex-1 text-center lg:text-left z-10 ${
      layout === '90s' ? 'font-mono' : ''
    }`}>
      <div className={`inline-block px-4 py-2 mb-6 rounded-full border backdrop-blur-sm ${
        layout === 'neon' ? 'bg-pink-900/30 border-pink-500/30' :
        layout === '90s' ? 'bg-yellow-900/30 border-yellow-500/30' :
        layout === 'terminal' ? 'bg-green-900/30 border-green-500/30' :
        'bg-indigo-500/10 border-indigo-500/20'
      }`}>
        <span className={`font-medium ${
          layout === 'neon' ? 'text-pink-400' :
          layout === '90s' ? 'text-yellow-400' :
          layout === 'terminal' ? 'text-green-400' :
          'text-indigo-400'
        }`}>👋 Welcome</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        Hi, I'm <br />
        <span className={
          layout === 'neon' ? 'text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-cyan-400' :
          layout === '90s' ? 'text-yellow-300 [text-shadow:2px_2px_0_#ff00ff]' :
          layout === 'terminal' ? 'text-green-400' :
          'heading-gradient'
        }>Sujay Halder</span>
      </h1>

      <div className={`text-2xl md:text-3xl mb-8 h-[40px] ${
        layout === 'neon' ? 'text-cyan-300' :
        layout === '90s' ? 'text-yellow-200' :
        layout === 'terminal' ? 'text-green-300' :
        'text-slate-300'
      }`}>
        <span className={`font-semibold ${
          layout === 'neon' ? 'text-pink-400' :
          layout === '90s' ? 'text-orange-400' :
          layout === 'terminal' ? 'text-green-400' :
          'text-indigo-400'
        }`}>{currentText}</span>
        <span className="animate-pulse">|</span>
      </div>

      <p className={`text-lg mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
        layout === 'neon' ? 'text-slate-300' :
        layout === '90s' ? 'text-yellow-200/80 font-mono' :
        layout === 'terminal' ? 'text-green-300/70 font-mono' :
        'text-slate-400'
      }`}>
        {layout === 'terminal'
          ? '> Creating innovative solutions with modern technologies. Specializing in scalable, high-performance applications.'
          : 'Creating innovative solutions and building amazing web experiences with modern technologies. I specialize in building scalable, high-performance applications.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
        <Button text="Get In Touch" onClick={() => scrollToSection('contact')} />
        <Button text="View My Work" onClick={() => scrollToSection('projects')} />
      </div>

      <div className="mt-12 flex items-center justify-center lg:justify-start gap-6">
        <a href="https://github.com/know120" target="_blank" rel="noopener noreferrer"
          className={`transition-colors transform hover:scale-110 ${
            layout === 'neon' ? 'text-pink-400 hover:text-pink-300' :
            layout === '90s' ? 'text-yellow-400 hover:text-yellow-300' :
            layout === 'terminal' ? 'text-green-400 hover:text-green-300' :
            'text-slate-400 hover:text-white'
          }`}>
          <i className="pi pi-github text-2xl"></i>
        </a>
        <a href="https://www.linkedin.com/in/sujayhalder" target="_blank" rel="noopener noreferrer"
          className={`transition-colors transform hover:scale-110 ${
            layout === 'neon' ? 'text-pink-400 hover:text-pink-300' :
            layout === '90s' ? 'text-yellow-400 hover:text-yellow-300' :
            layout === 'terminal' ? 'text-green-400 hover:text-green-300' :
            'text-slate-400 hover:text-white'
          }`}>
          <i className="pi pi-linkedin text-2xl"></i>
        </a>
        <a href="https://twitter.com/TheSujayHalder" target="_blank" rel="noopener noreferrer"
          className={`transition-colors transform hover:scale-110 ${
            layout === 'neon' ? 'text-pink-400 hover:text-pink-300' :
            layout === '90s' ? 'text-yellow-400 hover:text-yellow-300' :
            layout === 'terminal' ? 'text-green-400 hover:text-green-300' :
            'text-slate-400 hover:text-white'
          }`}>
          <i className="pi pi-twitter text-2xl"></i>
        </a>
      </div>
    </div>
  );

  const profileImage = (
    <div className="flex-1 flex justify-center items-center relative">
      <div className="relative w-72 h-72 md:w-96 md:h-96">
        <div className={`absolute inset-0 rounded-full border-2 animate-[spin_10s_linear_infinite] ${
          layout === 'neon' ? 'border-pink-500/30' :
          layout === '90s' ? 'border-yellow-500/50' :
          'border-indigo-500/30'
        }`}></div>
        <div className={`absolute inset-4 rounded-full border-2 animate-[spin_15s_linear_infinite_reverse] ${
          layout === 'neon' ? 'border-cyan-400/30' :
          layout === '90s' ? 'border-orange-500/50' :
          'border-purple-500/30'
        }`}></div>
        <div className={`absolute inset-8 rounded-full overflow-hidden border-4 shadow-2xl ${
          layout === 'neon' ? 'border-pink-800 shadow-pink-500/20' :
          layout === '90s' ? 'border-yellow-600 shadow-yellow-500/20' :
          'border-slate-800 shadow-indigo-500/20'
        }`}>
          <img
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            src="assets/img/me.jpg"
            alt="Sujay Halder"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );

  if (layout === 'neon') {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-10">
        <div className="absolute inset-0 bg-[#0d0221] -z-10"></div>
        <div className="absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 50%, #ff00ff20 50%)',
            backgroundSize: '100% 40px'
          }}
        ></div>
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-pink-600/10 blur-[100px] animate-pulse -z-10"></div>
        <div className="absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-cyan-600/10 blur-[100px] animate-pulse -z-10" style={{ animationDelay: '1s' }}></div>
        <div className="section-container w-full">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            {textContent}
            <div className="flex-1 flex justify-center items-center relative">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full border-2 border-pink-500/50 shadow-[0_0_30px_rgba(255,0,255,0.3)] animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-4 rounded-full border-2 border-cyan-400/40 shadow-[0_0_20px_rgba(0,255,247,0.2)] animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-pink-800 shadow-[0_0_40px_rgba(255,0,255,0.3)]">
                  <img className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="assets/img/me.jpg" alt="Sujay Halder" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'terminal') {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-10">
        <div className="absolute inset-0 bg-slate-950 -z-10"></div>
        <div className="section-container w-full">
          <div className="max-w-4xl mx-auto">
            <div className="border border-green-500/30 rounded-xl overflow-hidden shadow-2xl shadow-green-500/10">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-green-500/20">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="text-green-500/50 text-xs font-mono ml-2">sujay@portfolio:~</span>
              </div>
              <div className="p-6 md:p-10 bg-slate-950 font-mono">
                <div className="space-y-3 text-sm md:text-base">
                  <p className="text-green-400">$ <span className="text-green-300">cat about.md</span></p>
                  <div className="pl-4 border-l-2 border-green-500/30 space-y-2 mt-4 mb-6">
                    {textContent}
                  </div>
                  <p className="text-green-500/50">─══════════════════════════════════════─</p>
                  <p className="text-green-500/50">Type '<span className="text-green-300">scroll</span>' to navigate or use the menu above.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === '90s') {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-10">
        <div className="absolute inset-0 bg-[#1a0a2e] -z-10"></div>
        <div className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #ff00ff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #00ffff 1px, transparent 1px), radial-gradient(circle at 40% 80%, #ffff00 1px, transparent 1px)',
            backgroundSize: '40px 40px, 50px 50px, 30px 30px'
          }}
        ></div>
        <div className="section-container w-full">
          <div className="max-w-5xl mx-auto border-4 border-yellow-400/60 rounded-none p-1 shadow-[8px_8px_0_rgba(255,0,255,0.3)]">
            <div className="border-2 border-cyan-400/40 p-6 md:p-12">
              <div className="text-center mb-4">
                <span className="text-yellow-400 text-xs font-bold font-mono tracking-widest">★ ★ ★  WELCOME TO MY HOMEPAGE  ★ ★ ★</span>
              </div>
              <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
                {textContent}
                <div className="flex-1 flex justify-center">
                  <div className="relative w-56 h-56 md:w-72 md:h-72 border-4 border-orange-400 shadow-[8px_8px_0_rgba(255,102,0,0.3)] overflow-hidden">
                    <img src="assets/img/me.jpg" alt="Sujay Halder" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-6 border-t-2 border-dashed border-cyan-400/40 pt-4">
                <span className="text-cyan-400 text-xs font-mono animate-pulse">✦ Best viewed in Netscape Navigator 4.0 ✦</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="section-container w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {textContent}
          {profileImage}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
