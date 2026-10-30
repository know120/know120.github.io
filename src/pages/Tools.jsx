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

  const featuredAccent = featured?.accent ?? 'from-indigo-500 to-violet-600';
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

    if (sort === 'az') {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === 'newest') {
      return [...result].sort(
        (a, b) => new Date(b.added ?? 0) - new Date(a.added ?? 0)
      );
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
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute -top-10 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[110px]" />
        </div>

        {/* Hero */}
        <section className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            <i className="pi pi-bolt text-[10px]" aria-hidden="true" />
            The toolbox
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Small tools that do <span className="heading-gradient">big things</span>.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            A growing collection of browser-based utilities for designing, building, hiring,
            and everything in between. No installs, no accounts — just open and go.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <i className="pi pi-th-large text-xs text-indigo-400" aria-hidden="true" />
              {tools.length} tools
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="pi pi-tag text-xs text-cyan-400" aria-hidden="true" />
              {toolCategories.length - 1} categories
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="pi pi-shield text-xs text-emerald-400" aria-hidden="true" />
              100% browser-based
            </span>
          </div>

          {/* Search + sort */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <i
                className="pi pi-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools, tags, or categories…"
                aria-label="Search tools"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-24 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-indigo-400/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-indigo-500/10 [&::-webkit-search-cancel-button]:hidden"
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
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <i className="pi pi-times text-xs" aria-hidden="true" />
                  </button>
                ) : (
                  <kbd className="hidden rounded border border-white/10 bg-slate-900/60 px-1.5 py-0.5 font-sans text-[10px] text-slate-500 sm:block">
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
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 text-sm text-slate-300 outline-none transition-all hover:bg-white/[0.07] focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10 sm:w-44"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-900">
                    Sort: {option.label}
                  </option>
                ))}
              </select>
              <i
                className="pi pi-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mt-5 flex flex-wrap gap-2">
            {toolCategories.map((name) => {
              const active = category === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                    active
                      ? 'border-transparent bg-white text-slate-900 shadow-lg shadow-black/20'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {name}
                  <span
                    className={`text-[11px] tabular-nums ${
                      active ? 'text-slate-500' : 'text-slate-600'
                    }`}
                  >
                    {countForCategory(name)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured */}
        {!isFiltering && featured && (
          <section className="relative mt-14">
            <a
              href={`/#${featured.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative grid overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-indigo-500/15 via-slate-900 to-slate-900 p-6 transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_30px_70px_-30px_rgba(99,102,241,0.7)] sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl transition-opacity duration-300 group-hover:opacity-80"
                aria-hidden="true"
              />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">
                  <i className="pi pi-star-fill text-[10px]" aria-hidden="true" />
                  Featured tool
                </span>

                <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  {featured.name}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  {featured.longDescription ?? featured.description}
                </p>

                {featured.highlights?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featured.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                      >
                        <i className="pi pi-check text-[10px] text-emerald-400" aria-hidden="true" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                <span className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors group-hover:bg-indigo-100">
                  Open tool
                  <i
                    className="pi pi-external-link text-[10px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div className="relative mt-8 hidden items-center justify-center lg:mt-0 lg:flex">
                <div
                  className="absolute h-60 w-60 rounded-full border border-white/10"
                  aria-hidden="true"
                />
                <div
                  className="absolute h-44 w-44 rounded-full border border-white/10"
                  aria-hidden="true"
                />
                <div
                  className="absolute h-28 w-28 rounded-full bg-indigo-500/20 blur-2xl"
                  aria-hidden="true"
                />
                <div
                  className={`relative flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br ${featuredAccent} text-white shadow-2xl shadow-indigo-950/50 transition-transform duration-300 group-hover:scale-105`}
                >
                  <i className={`${featuredIcon} text-4xl`} aria-hidden="true" />
                </div>
              </div>
            </a>
          </section>
        )}

        {/* Tool grid */}
        <section className="relative mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isFiltering ? 'Results' : 'All tools'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
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
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-white/20 hover:text-white"
              >
                <i className="pi pi-filter-slash text-xs" aria-hidden="true" />
                Clear filters
              </button>
            )}
          </div>

          {filteredTools.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-500">
                <i className="pi pi-search text-lg" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">No tools found</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Nothing matched your search. Try a different keyword or browse another category.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-indigo-100"
              >
                Reset filters
                <i className="pi pi-refresh text-xs" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>

        <div className="relative mt-16 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6 text-sm text-slate-400 sm:flex-row">
          <p className="inline-flex items-center gap-2 text-center sm:text-left">
            <i className="pi pi-lock text-xs text-emerald-400" aria-hidden="true" />
            Everything runs in your browser — no installs, no accounts, no tracking.
          </p>

          <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
            <a
              href="https://github.com/know120"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm text-slate-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white sm:flex-none"
            >
              <i className="pi pi-github text-xs" aria-hidden="true" />
              GitHub
            </a>
            <Link
              to="/"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-indigo-100 sm:flex-none"
            >
              Portfolio
              <i className="pi pi-arrow-up-right text-xs" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
