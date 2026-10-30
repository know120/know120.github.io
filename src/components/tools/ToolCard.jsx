const badgeStyles = {
  New: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Popular: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Beta: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
};

export default function ToolCard({ tool }) {
  return (
    <a
      href={`/#${tool.path}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_24px_50px_-24px_rgba(99,102,241,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400"
    >
      {/* Accent glow */}
      <div
        className={`pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-linear-to-br ${tool.accent} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-30`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${tool.accent} text-white shadow-lg shadow-black/30`}
        >
          <i className={`${tool.icon} text-lg`} aria-hidden="true" />
        </div>

        {tool.badge && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeStyles[tool.badge] ?? badgeStyles.Beta}`}
          >
            {tool.badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white transition-colors group-hover:text-indigo-300">
        {tool.name}
      </h3>

      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-400">
        {tool.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/5 bg-slate-900/60 px-2 py-1 text-[11px] font-medium text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {tool.category}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
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
