
import PropTypes from 'prop-types';
const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="group relative h-full">
      <div className="glass-panel glass-interactive flex h-full flex-col overflow-hidden rounded-3xl">

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 z-10 bg-linear-to-t from-[#070b1d] via-[#070b1d]/20 to-transparent opacity-80"></div>
          <img
            src={project.image || 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Project'}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Floating Tech Stack */}
          <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="glass-chip px-2 py-1 text-xs font-medium text-[var(--accent-secondary)]"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 3 && (
              <span className="glass-chip px-2 py-1 text-xs font-medium text-[var(--text-secondary)]">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-[var(--accent-secondary)]">
            {project.title}
          </h3>

          <p className="mb-4 line-clamp-3 flex-1 text-sm text-[var(--text-secondary)]/80">
            {project.description}
          </p>

          {/* Features List (Mini) */}
          {project.features && project.features.length > 0 && (
            <div className="mb-4 space-y-1">
              {project.features.slice(0, 2).map((feature, idx) => (
                <div key={idx} className="flex items-center text-xs text-[var(--text-tertiary)]">
                  <i className="pi pi-check-circle mr-2 text-[var(--accent-secondary)]/70"></i>
                  {feature}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 px-4 py-2 text-sm"
              >
                <i className="pi pi-external-link mr-2 text-xs"></i>
                Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-secondary px-4 py-2 text-sm ${project.liveDemo ? 'flex-1' : 'w-full'}`}
              >
                <i className="pi pi-github mr-2 text-xs"></i>Code
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
