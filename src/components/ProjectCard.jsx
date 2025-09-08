import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ project }) => {
  const [transform, setTransform] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // Safety check for project data
  if (!project) {
    return (
      <div className="">
        <div className="" style={{ background: '#2a2a2a', padding: '2rem', borderRadius: '20px' }}>
          <p style={{ color: 'white', textAlign: 'center' }}>No project data available</p>
        </div>
      </div>
    );
  }

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
      className="w-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      <div
        className='bg-neutral-900 rounded-2xl w-full p-4'
        style={{ transform }}
      >
        <div className="">
          <div className="">
            {/* to be handled later */}
            {/* <img src={project.image || 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Project'} alt={project.title || 'Project'} /> */}
            {/* <div className="">
              <button 
                className="flip-btn"
                onClick={() => setIsFlipped(true)}
              >
                <i className="pi pi-info-circle"></i>
              </button>
            </div> */}
          </div>
          <div className="">
            <h3 className="font-bold text-center text-2xl text-purple-700">{project.title || 'Untitled Project'}</h3>
            <p className="">{project.description || 'No description available'}</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {(project.technologies || []).map((tech, index) => (
                <span key={index} className="">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="">
          <div className="">
            <h3 className="">{project.title || 'Untitled Project'}</h3>
            <div className="">
              <h4>Key Features:</h4>
              <ul>
                {(project.features || []).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="">
              <div className="">
                <span className="">Duration:</span>
                <span className="">{project.duration || 'N/A'}</span>
              </div>
              <div className="">
                <span className="">Team Size:</span>
                <span className="">{project.teamSize || 'N/A'}</span>
              </div>
            </div>
            {/* <div className="">
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
            </div> */}
            {/* <button 
              className=""
              onClick={() => setIsFlipped(false)}
            >
              <i className="pi pi-arrow-left"></i>
            </button> */}
          </div>
        </div>

        <div className=""></div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.string),
    features: PropTypes.arrayOf(PropTypes.string),
    duration: PropTypes.string,
    teamSize: PropTypes.string,
    liveDemo: PropTypes.string,
    github: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default ProjectCard;