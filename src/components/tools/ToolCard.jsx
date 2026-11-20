const badgeStyles = {
  New: 'border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]',
  Popular: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  Beta: 'border-[var(--accent-secondary)]/40 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]',
};

export default function ToolCard({ tool }) {
  const accent = tool.accent ?? 'from-lime-300 to-emerald-500';
  const icon = tool.icon ?? 'pi pi-box';
  const tags = tool.tags ?? [];

  return (
    <a
      href={`/#${tool.path}`}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel glass-interactive group relative flex h-full flex-col overflow-hidden rounded-sm p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center bg-linear-to-br ${accent} text-[#080a0f] shadow-lg`}>
          <i className={`${icon} text-lg`} aria-hidden="true" />
        </div>

        {tool.badge && (
          <span className={`glass-chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeStyles[tool.badge] ?? badgeStyles.Beta}`}>
            {tool.badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
        {tool.name}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
        {tool.description}
      </p>

      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="glass-chip px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
          {tool.category}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-primary)]">
          Open
          <i className="pi pi-arrow-up-right text-[10px]" />
        </span>
      </div>
    </a>
  );
}
