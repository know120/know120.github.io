import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  const { slug, title, date, category, readTime, excerpt, image } = post;

  return (
    <article className="glass-panel glass-interactive group flex h-full flex-col overflow-hidden rounded-sm">
      <div className="relative h-44 overflow-hidden border-b border-[var(--glass-border)]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(120%_120%_at_30%_0%,rgba(214,255,75,0.14),rgba(10,14,21,0.9))]">
            <i className="pi pi-pencil text-4xl text-[var(--accent-primary)] opacity-50" />
          </div>
        )}

        {category && (
          <div className="absolute left-4 top-4">
            <span className="glass-chip bg-[var(--bg-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="flex grow flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1.5">
            <i className="pi pi-calendar text-[var(--accent-primary)]" />
            {date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="pi pi-clock text-[var(--accent-primary)]" />
            {readTime || '5 min'} read
          </span>
        </div>

        <h3 className="mb-3 line-clamp-2 text-lg font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
          {title}
        </h3>

        <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
          {excerpt || 'Notes, experiments, and practical lessons from building software.'}
        </p>

        <div className="mt-auto border-t border-[var(--glass-border)] pt-4">
          <Link
            to={`/blog/${slug}`}
            className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]"
          >
            Read More
            <i className="pi pi-arrow-right text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
