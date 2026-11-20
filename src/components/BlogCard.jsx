import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
    const { slug, title, date, category, readTime, excerpt, image } = post;

    return (
        <div className="group relative h-full">
            {/* Soft refraction glow on hover */}
            <div className="absolute -inset-2 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(124,140,255,0.35),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

            <div className="glass-panel glass-interactive relative flex h-full flex-col overflow-hidden rounded-3xl">
                {/* Card Image/Placeholder */}
                <div className="relative h-48 overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(120%_120%_at_30%_0%,rgba(124,140,255,0.28),rgba(10,16,36,0.6))] transition-transform duration-700 group-hover:scale-105">
                            <i className="pi pi-pencil text-4xl text-[var(--accent-secondary)] opacity-60"></i>
                        </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#070b1d]/80 via-transparent to-transparent" />

                    {/* Category Tag */}
                    {category && (
                        <div className="absolute left-4 top-4">
                            <span className="glass-chip px-3 py-1 text-xs font-semibold text-[var(--accent-secondary)]">
                                {category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="flex grow flex-col p-6">
                    <div className="mb-3 flex items-center space-x-4 text-xs text-[var(--text-tertiary)]">
                        <span className="flex items-center">
                            <i className="pi pi-calendar mr-1.5 text-[10px]"></i>
                            {date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                        </span>
                        <span className="flex items-center">
                            <i className="pi pi-clock mr-1.5 text-[10px]"></i>
                            {readTime || '5 min'} read
                        </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-[var(--accent-secondary)]">
                        {title}
                    </h3>

                    <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]/80">
                        {excerpt || "Explore the latest insights and best practices in web development and technology."}
                    </p>

                    <div className="mt-auto">
                        <Link
                            to={`/blog/${slug}`}
                            className="group/btn inline-flex items-center text-sm font-semibold text-[var(--accent-secondary)]"
                        >
                            Read More
                            <i className="pi pi-arrow-right ml-2 text-xs transition-transform group-hover/btn:translate-x-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
