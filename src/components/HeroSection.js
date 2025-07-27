import React, { useState, useEffect } from 'react';
import './HeroSection.css';

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
    <section id="home" className="w-100 vh-100">
      <div className="container-fluid h-100 px-0 d-flex align-items-center hero-section">
        <div className="hero-particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`hero-particle hero-particle-${i}`}></div>
          ))}
        </div>
        
        <div className="row d-flex align-items-center justify-content-center w-100 mx-0">
          <div className="col-12 col-md-6 col-lg-5 text-center mb-4 mb-md-0 px-4">
            <div className="profile-container">
              <img
                className="profile-image rounded-circle img-fluid"
                src="assets/img/me.jpg"
                alt="Sujay Halder"
                loading="lazy"
              />
              {/* <div className="profile-ring"></div> */}
              <div className="profile-glow"></div>
            </div>
          </div>
          
          <div className="col-12 col-md-6 col-lg-7 text-center text-md-start px-4">
            <div className="hero-content">
              <div className="hero-greeting">👋 Hello, I'm</div>
              <h1 className="hero-title display-4 fw-bold mb-3">Sujay Halder</h1>
              <div className="hero-subtitle-container">
                <span className="hero-subtitle-static">A </span>
                <span className="hero-subtitle-dynamic">
                  {currentText}
                  <span className="typing-cursor">|</span>
                </span>
              </div>
              
              <p className="hero-description lead mt-4">
                Creating innovative solutions and building amazing web experiences 
                with modern technologies. Let's build something great together!
              </p>
              
              <div className="hero-buttons mt-4">
                <button 
                  className="btn btn-primary btn-lg me-3 mb-2"
                  onClick={() => scrollToSection('contact')}
                >
                  <i className="pi pi-envelope me-2"></i>
                  Get In Touch
                </button>
                <button 
                  className="btn btn-outline-light btn-lg mb-2"
                  onClick={() => scrollToSection('projects')}
                >
                  <i className="pi pi-eye me-2"></i>
                  View My Work
                </button>
              </div>
              
              <div className="hero-social mt-4">
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
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>Scroll Down</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;