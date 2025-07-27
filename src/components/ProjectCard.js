import React, { useState } from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const [transform, setTransform] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`);
    }
  };

  return (
    <div 
      className="project-card-container h-100"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      <div 
        className={`project-card h-100 ${isFlipped ? 'flipped' : ''}`}
        style={{ transform }}
      >
        <div className="project-card-front">
          <div className="project-image">
            <img src={project.image} alt={project.title} />
            <div className="project-overlay">
              <button 
                className="flip-btn"
                onClick={() => setIsFlipped(true)}
              >
                <i className="pi pi-info-circle"></i>
              </button>
            </div>
          </div>
          <div className="project-content">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="project-card-back">
          <div className="project-details">
            <h3 className="project-title">{project.title}</h3>
            <div className="project-features">
              <h4>Key Features:</h4>
              <ul>
                {project.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="project-stats">
              <div className="stat">
                <span className="stat-label">Duration:</span>
                <span className="stat-value">{project.duration}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Team Size:</span>
                <span className="stat-value">{project.teamSize}</span>
              </div>
            </div>
            <div className="project-actions">
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <i className="pi pi-external-link me-2"></i>Live Demo
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                  <i className="pi pi-github me-2"></i>Code
                </a>
              )}
            </div>
            <button 
              className="back-btn"
              onClick={() => setIsFlipped(false)}
            >
              <i className="pi pi-arrow-left"></i>
            </button>
          </div>
        </div>
        
        <div className="project-card-shine"></div>
      </div>
    </div>
  );
};

export default ProjectCard;