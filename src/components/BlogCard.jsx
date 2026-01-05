import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
    const { slug, title, date, category, readTime, excerpt, image } = post;

    return (
        <div className="group relative">
            {/* Glow Effect on Hover */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

            <div className="glass-panel relative flex flex-col h-full rounded-2xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
                {/* Card Image/Placeholder */}
                <div className="relative h-48 overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-indigo-900/40 to-slate-800 flex items-center justify-center group-hover:scale-110 transition duration-500">
                            <i className="pi pi-pencil text-4xl text-indigo-400 opacity-50"></i>
                        </div>
                    )}

                    {/* Category Tag */}
                    {category && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                                {category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col grow">
                    <div className="flex items-center text-xs text-slate-400 mb-3 space-x-4">
                        <span className="flex items-center">
                            <i className="pi pi-calendar mr-1.5 text-[10px]"></i>
                            {date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                        </span>
                        <span className="flex items-center">
                            <i className="pi pi-clock mr-1.5 text-[10px]"></i>
                            {readTime || '5 min'} read
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {excerpt || "Explore the latest insights and best practices in web development and technology."}
                    </p>

                    <div className="mt-auto">
                        <Link
                            to={`/blog/${slug}`}
                            className="inline-flex items-center text-indigo-400 font-semibold text-sm group/btn"
                        >
                            Read More
                            <i className="pi pi-arrow-right ml-2 text-xs transform group-hover/btn:translate-x-1 transition-transform"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;