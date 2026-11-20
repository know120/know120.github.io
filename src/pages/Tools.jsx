import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToolCard from '../components/tools/ToolCard';
import { featuredTool as featured, tools, toolCategories } from '../config/tools';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'az', label: 'A–Z' },
  { value: 'newest', label: 'Newest' },
];

export default function Tools() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const searchRef = useRef(null);

  const featuredAccent = featured?.accent ?? 'from-lime-300 to-emerald-500';
  const featuredIcon = featured?.icon ?? 'pi pi-box';

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeTag = document.activeElement?.tagName;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag);

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('');
        searchRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isFiltering = query.trim() !== '' || category !== 'All';

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = tools.filter((tool) => {
      const matchesCategory = category === 'All' || tool.category === category;
      const searchable = [tool.name, tool.description, tool.category, ...(tool.tags ?? [])]
        .join(' ')
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });

    if (sort === 'az') return [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'newest') {
      return [...result].sort((a, b) => new Date(b.added ?? 0) - new Date(a.added ?? 0));
    }
    return result;
  }, [query, category, sort]);

  const countForCategory = (name) =>
    name === 'All' ? tools.length : tools.filter((tool) => tool.category === name).length;

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
    setSort('featured');
  };

  return (
    <div className="relative min-h-screen text-[var(--text-primary)]">
      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <section className="relative">
          <span className="eyebrow">The toolbox</span>

          <h1 className="mt-6 max-w-4xl text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[var(--text-primary)]">
            Small tools that do <span className="heading-gradient">big things</span>.
          </h1>

          <div className="editorial-rule mt-8 max-w-3xl" />

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            A growing collection of browser-based utilities for designing, building, hiring,
            and everything in between. No installs, no accounts — just open and go.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            <span className="inline-flex items-center gap-2">
              <i className="pi pi-th-large text-xs text-[var(--accent-primary)]" />
              {tools.length} tools
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="pi pi-tag text-xs text-[var(--accent-secondary)]" />
              {toolCategories.length - 1} categories
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="pi pi-shield text-xs text-[var(--accent-tertiary)]" />
              100% browser-based
            </span>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <i
                className="pi pi-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-tertiary)]"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools, tags, or categories…"
                aria-label="Search tools"
                className="glass-input h-12 pl-11 pr-24 text-sm [&::-webkit-search-cancel-button]:hidden"
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      searchRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="flex h-7 w-7 items-center justify-center text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent-primary)]"
                  >
                    <i className="pi pi-times text-xs" />
                  </button>
                ) : (
                  <kbd className="hidden rounded-sm border border-[var(--glass-border)] bg-[var(--bg-primary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-tertiary)] sm:block">
                    /
                  </kbd>
                )}
              </div>
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort tools"
                className="glass-input h-12 w-full cursor-pointer appearance-none pl-4 pr-10 text-sm sm:w-44"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[var(--bg-primary)]">
                    Sort: {option.label}
                  </option>
                ))}
              </select>
              <i
                className="pi pi-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {toolCategories.map((name) => {
              const active = category === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  aria-pressed={active}
                  className={`glass-chip px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider ${active ? 'glass-chip-active' : ''}`}
                >
                  {name}
                  <span className={`text-[10px] tabular-nums ${active ? 'opacity-70' : 'text-[var(--text-tertiary)]'}`}>
                    {countForCategory(name)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {!isFiltering && featured && (
          <section className="relative mt-16">
            <a
              href={`/#${featured.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel glass-interactive group relative grid overflow-hidden rounded-sm p-6 sm:p-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
            >
              <div className="relative">
                <span className="glass-chip border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary)]">
                  <i className="pi pi-star-fill text-[10px]" />
                  Featured tool
                </span>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                  {featured.name}
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                  {featured.longDescription ?? featured.description}
                </p>

                {featured.highlights?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featured.highlights.map((highlight) => (
                      <span key={highlight} className="glass-chip px-2.5 py-1 text-[11px] text-[var(--text-secondary)]">
                        <i className="pi pi-check text-[10px] text-[var(--accent-primary)]" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                <span className="btn-primary mt-7 inline-flex px-5 py-2.5 text-sm">
                  Open tool
                  <i className="pi pi-external-link text-[10px]" />
                </span>
              </div>

              <div className="relative mt-10 hidden items-center justify-center lg:mt-0 lg:flex">
                <div className="absolute h-64 w-64 border border-[var(--glass-border)]" />
                <div className="absolute h-48 w-48 rotate-45 border border-[var(--glass-border)]" />
                <div className={`relative flex h-24 w-24 items-center justify-center bg-linear-to-br ${featuredAccent} text-[#080a0f] shadow-2xl`}>
                  <i className={`${featuredIcon} text-4xl`} />
                </div>
              </div>
            </a>
          </section>
        )}

        <section className="relative mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="section-index">INDEX</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {isFiltering ? 'Results' : 'All tools'}
              </h2>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
                {filteredTools.length === tools.length
                  ? `${tools.length} tools ready to use`
                  : `${filteredTools.length} of ${tools.length} tools`}
                {category !== 'All' && ` in ${category}`}
                {query.trim() && ` matching “${query.trim()}”`}
              </p>
            </div>

            {isFiltering && (
              <button
                type="button"
                onClick={clearFilters}
                className="glass-chip rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
              >
                <i className="pi pi-filter-slash text-xs" />
                Clear filters
              </button>
            )}
          </div>

          {filteredTools.length > 0 ? (
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="glass-panel mt-7 rounded-sm px-6 py-16 text-center">
              <div className="glass-chip mx-auto flex h-12 w-12 items-center justify-center text-[var(--text-tertiary)]">
                <i className="pi pi-search text-lg" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">No tools found</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--text-tertiary)]">
                Nothing matched your search. Try a different keyword or browse another category.
              </p>
              <button type="button" onClick={clearFilters} className="btn-primary mt-5 px-4 py-2 text-sm">
                Reset filters
                <i className="pi pi-refresh text-xs" />
              </button>
            </div>
          )}
        </section>

        <div className="glass-panel relative mt-16 flex flex-col items-center justify-between gap-5 rounded-sm px-6 py-6 text-sm text-[var(--text-secondary)] sm:flex-row">
          <p className="inline-flex items-center gap-2 text-center sm:text-left">
            <i className="pi pi-lock text-xs text-[var(--accent-primary)]" />
            Everything runs in your browser — no installs, no accounts, no tracking.
          </p>

          <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
            <a
              href="https://github.com/know120"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-chip h-10 flex-1 px-4 text-xs font-semibold uppercase tracking-wider sm:flex-none"
            >
              <i className="pi pi-github text-xs" />
              GitHub
            </a>
            <Link to="/" className="btn-primary h-10 flex-1 px-4 text-sm sm:flex-none">
              Portfolio
              <i className="pi pi-arrow-up-right text-xs" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
