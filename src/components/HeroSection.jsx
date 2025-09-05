import React, { useState, useEffect } from 'react';
// import './HeroSection.css';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = [
    'Full Stack Developer',
    'React Expert',
    // 'Angular Expert',
    // 'Problem Solver'
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
    <section id="home" className="h-screen md:mx-5">
      <div className="flex flex-col md:flex-row justify-between items-center h-full">
        <div className='border border-purple-600 rounded-full overflow-hidden hover:scale-110 transform transition-all duration-300 ease-in-out'>
          <img
            className="w-md"
            src="assets/img/me.jpg"
            alt="Sujay Halder"
            loading="lazy"
          />
        </div>
        <div className="md:mx-2.5 md:max-w-1/2">
          {/* <div className="items-center"> */}
            <div className="text-left">
              <div className="text-2xl mb-2">👋 Hello, I'm</div>
              <h1 className="text-5xl font-bold mb-5 text-violet-800">Sujay Halder</h1>
              <div className="text-2xl mb-2">
                <span className="">A </span>
                <span className=" text-indigo-700 font-bold">
                  {currentText}
                  <span className="">|</span>
                </span>
              </div>

              <p className="mt-5 text-xl text-neutral-400">
                Creating innovative solutions and building amazing web experiences
                with modern technologies. Let's build something great together!
              </p>

              <div className="mt-10">
                <button
                  className="rounded-md border border-neutral-800 m-2 p-2 bg-indigo-700 transform transition-all duration-300 ease-in-out hover:-translate-y-1"
                  onClick={() => scrollToSection('contact')}
                >
                  <i className="pi pi-envelope me-2"></i>Get In Touch
                </button>
                <button
                  className="rounded-md border border-neutral-800 m-2 p-2 hover:bg-neutral-200 transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:text-neutral-800"
                  onClick={() => scrollToSection('projects')}
                >
                  <i className="pi pi-eye me-2"></i>View My Work
                </button>
              </div>

              <div className="rounded space-x-4 mt-5">
                <a href="https://github.com/know120" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="pi pi-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/sujayhalder" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="pi pi-linkedin"></i>
                </a>
                <a href="https://twitter.com/TheSujayHalder" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="pi pi-twitter"></i>
                </a>
              </div>
            {/* </div> */}
          </div>
        </div>

        {/* <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>Scroll Down</span>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;