import React, { useState, useEffect } from 'react';
import Button from "../components/common/Button"

const HeroSection = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = [
    'Full Stack .NET Developer with React'
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
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="section-container w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm">
              <span className="text-indigo-400 font-medium">👋 Welcome to my portfolio</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Hi, I'm <br />
              <span className="heading-gradient">Sujay Halder</span>
            </h1>

            <div className="text-2xl md:text-3xl mb-8 text-slate-300 h-[40px]">
              A <span className="text-indigo-400 font-semibold">{currentText}</span>
              <span className="animate-pulse">|</span>
            </div>

            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Creating innovative solutions and building amazing web experiences
              with modern technologies. I specialize in building scalable, high-performance applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button text="Get In Touch" onClick={() => scrollToSection('contact')} />
              <Button text="View My Work" onClick={() => scrollToSection('projects')} />
              {/* <button
                onClick={() => scrollToSection('contact')}
                className="btn-primary w-full sm:w-auto group"
              >
                <span className="flex items-center justify-center gap-2">
                  <i className="pi pi-envelope"></i>
                  Get In Touch
                  <i className="pi pi-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </span>
              </button> */}

              {/* <button
                onClick={() => scrollToSection('projects')}
                className="btn-secondary w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-2">
                  <i className="pi pi-eye"></i>
                  View My Work
                </span>
              </button> */}
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6">
              <a href="https://github.com/know120" target="_blank" rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors transform hover:scale-110">
                <i className="pi pi-github text-2xl"></i>
              </a>
              <a href="https://www.linkedin.com/in/sujayhalder" target="_blank" rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors transform hover:scale-110">
                <i className="pi pi-linkedin text-2xl"></i>
              </a>
              <a href="https://twitter.com/TheSujayHalder" target="_blank" rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors transform hover:scale-110">
                <i className="pi pi-twitter text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="flex-1 flex justify-center items-center relative">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border-2 border-purple-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>

              {/* Main Image Container */}
              <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl shadow-indigo-500/20">
                <img
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  src="assets/img/me.jpg"
                  alt="Sujay Halder"
                  loading="lazy"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -right-4 top-20 glass-panel p-3 rounded-xl animate-bounce" style={{ animationDuration: '3s' }}>
                <i className="pi pi-code text-indigo-400 text-xl"></i>
              </div>
              <div className="absolute -left-4 bottom-20 glass-panel p-3 rounded-xl animate-bounce" style={{ animationDuration: '4s' }}>
                <i className="pi pi-database text-purple-400 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;