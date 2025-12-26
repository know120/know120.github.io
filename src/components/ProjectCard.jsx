import React from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="group relative h-full">
      <div className="glass-panel rounded-2xl overflow-hidden h-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-2 flex flex-col">

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-60"></div>
          <img
            src={project.image || 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Project'}
            alt={project.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />

          {/* Floating Tech Stack */}
          <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="text-xs font-medium px-2 py-1 rounded-md bg-slate-900/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 3 && (
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-900/80 text-slate-400 border border-slate-700 backdrop-blur-sm">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
            {project.description}
          </p>

          {/* Features List (Mini) */}
          {project.features && project.features.length > 0 && (
            <div className="mb-4 space-y-1">
              {project.features.slice(0, 2).map((feature, idx) => (
                <div key={idx} className="flex items-center text-xs text-slate-500">
                  <i className="pi pi-check-circle text-indigo-500/70 mr-2"></i>
                  {feature}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                <i className="pi pi-external-link mr-2"></i>Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 text-center py-2 rounded-lg border border-slate-600 hover:border-slate-400 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-all ${!project.liveDemo ? 'w-full' : ''}`}
              >
                <i className="pi pi-github mr-2"></i>Code
              </a>
            )}
          </div>
        </div>
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