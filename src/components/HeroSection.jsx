import React, { useState, useEffect } from 'react';
import Button from "../components/common/Button"

const HeroSection = () => {
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

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-10">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-12%] top-[-18%] h-[36rem] w-[36rem] rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-12%] h-[34rem] w-[34rem] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
      </div>

      <div className="section-container w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="glass-chip mb-6 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Welcome to my corner of the web</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.05] tracking-tight text-[var(--text-primary)]">
              Hi, I'm <br />
              <span className="heading-gradient">Sujay Halder</span>
            </h1>

            <div className="text-2xl md:text-3xl mb-8 text-[var(--text-secondary)] h-[40px]">
              <span className="font-semibold text-[var(--accent-secondary)]">{currentText}</span>
              <span className="ml-1 animate-pulse text-[var(--accent-primary)]">|</span>
            </div>

            <p className="text-lg text-[var(--text-secondary)]/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Creating innovative solutions and building amazing web experiences
              with modern technologies. I specialize in building scalable, high-performance applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button text="Get In Touch" onClick={() => scrollToSection('contact')} />
              <Button text="View My Work" variant="secondary" onClick={() => scrollToSection('projects')} />
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-3">
              <a href="https://github.com/know120" target="_blank" rel="noopener noreferrer"
                className="icon-button h-11 w-11" aria-label="GitHub">
                <i className="pi pi-github text-lg"></i>
              </a>
              <a href="https://www.linkedin.com/in/sujayhalder" target="_blank" rel="noopener noreferrer"
                className="icon-button h-11 w-11" aria-label="LinkedIn">
                <i className="pi pi-linkedin text-lg"></i>
              </a>
              <a href="https://twitter.com/TheSujayHalder" target="_blank" rel="noopener noreferrer"
                className="icon-button h-11 w-11" aria-label="Twitter">
                <i className="pi pi-twitter text-lg"></i>
              </a>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="flex-1 flex justify-center items-center relative">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Decorative orbits */}
              <div className="absolute inset-0 rounded-full border border-indigo-400/20 animate-[spin_18s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-cyan-400/15 animate-[spin_26s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true" />

              {/* Main Image Container */}
              <div className="absolute inset-8 rounded-full bg-[conic-gradient(from_180deg,rgba(124,140,255,0.7),rgba(100,227,255,0.55),rgba(192,132,252,0.6),rgba(251,113,133,0.45),rgba(124,140,255,0.7))] p-[2px] shadow-[0_30px_80px_-30px_rgba(99,102,241,0.9)]">
                <div className="relative h-full w-full overflow-hidden rounded-full border border-white/20 bg-slate-950/40">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    src="assets/img/me.jpg"
                    alt="Sujay Halder"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(120%_80%_at_30%_0%,rgba(255,255,255,0.35),transparent_45%)]" />
                </div>
              </div>

              {/* Floating badges */}
              <div className="glass-panel absolute -right-4 top-20 animate-bounce rounded-2xl p-3" style={{ animationDuration: '4s' }}>
                <i className="pi pi-code text-xl text-[var(--accent-secondary)]"></i>
              </div>
              <div className="glass-panel absolute -left-4 bottom-20 animate-bounce rounded-2xl p-3" style={{ animationDuration: '5s' }}>
                <i className="pi pi-database text-xl text-[var(--accent-tertiary)]"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;