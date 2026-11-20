const badgeStyles = {
  New: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  Popular: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  Beta: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
};

export default function ToolCard({ tool }) {
  const accent = tool.accent ?? 'from-indigo-500 to-violet-600';
  const icon = tool.icon ?? 'pi pi-box';
  const tags = tool.tags ?? [];

  return (
    <a
      href={`/#${tool.path}`}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel glass-interactive group relative flex h-full flex-col overflow-hidden rounded-3xl p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)]"
    >
      {/* Accent refraction */}
      <div
        className={`pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-linear-to-br ${accent} opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-35`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-linear-to-br ${accent} text-white shadow-[0_12px_30px_-12px_rgba(99,102,241,0.9),inset_0_1px_0_rgba(255,255,255,0.3)]`}
        >
          <i className={`${icon} text-lg`} aria-hidden="true" />
        </div>

        {tool.badge && (
          <span
            className={`glass-chip px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeStyles[tool.badge] ?? badgeStyles.Beta}`}
          >
            {tool.badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white transition-colors group-hover:text-[var(--accent-secondary)]">
        {tool.name}
      </h3>

      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]/80">
        {tool.description}
      </p>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="glass-chip rounded-lg px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          {tool.category}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors group-hover:text-white">
          Open
          <i
            className="pi pi-external-link text-[10px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  );
}
