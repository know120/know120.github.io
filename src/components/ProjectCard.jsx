import PropTypes from 'prop-types';

const ProjectCard = ({ project, number }) => {
  if (!project) return null;

  return (
    <article className="glass-panel glass-interactive group flex h-full flex-col overflow-hidden rounded-sm">
      <div className="relative h-52 overflow-hidden border-b border-[var(--glass-border)]">
        <img
          src={project.image || 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Project'}
          alt={project.title}
          className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-80" />

        {number && (
          <span className="absolute right-4 top-4 font-mono text-4xl font-bold leading-none text-white/25">
            {number}
          </span>
        )}

        <div className="absolute bottom-3 left-4 z-20 flex flex-wrap gap-2">
          {(project.technologies || []).slice(0, 3).map((tech) => (
            <span key={tech} className="glass-chip px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
              {tech}
            </span>
          ))}
          {(project.technologies || []).length > 3 && (
            <span className="glass-chip px-2 py-1 text-[10px] text-[var(--text-secondary)]">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
          {project.title}
        </h3>

        <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
          {project.description}
        </p>

        {project.features?.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-2">
            {project.features.slice(0, 2).map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-xs text-[var(--text-tertiary)]">
                <i className="pi pi-check-circle mt-0.5 text-[var(--accent-primary)]" />
                {feature}
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 border-t border-[var(--glass-border)] pt-5">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 px-4 py-2 text-sm"
            >
              <i className="pi pi-external-link text-xs" />
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
              <i className="pi pi-github text-xs" />
              Code
            </a>
          )}
        </div>
      </div>
    </article>
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
  number: PropTypes.string,
};

export default ProjectCard;
