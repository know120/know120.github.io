import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { posts } from "../utils/postUtils";
import GlowingLine from "./common/GlowingLine";
import BlogCard from "./BlogCard";
import { useLayout } from '../contexts/LayoutContext';


const Blog = () => {
    const { layout } = useLayout();
    const [latestPosts, setLatestPosts] = useState([]);

    useEffect(() => {
        setLatestPosts(posts.slice(0, 3));
    }, []);

    if (layout === 'neon') {
        return (
            <section id="blog" className="py-20 relative overflow-hidden bg-[#0d0221]/30">
                <div className="section-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-cyan-400">Latest Insights</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Exploring the frontiers of web technology.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {latestPosts.map((post) => (
                            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                                <div className="border border-pink-500/30 bg-[#0d0221] p-5 h-full shadow-[0_0_15px_rgba(255,0,255,0.1)] hover:shadow-[0_0_25px_rgba(255,0,255,0.2)] transition-shadow">
                                    <div className="flex items-center gap-2 text-xs text-cyan-400 mb-3">
                                        <span>{post.date ? new Date(post.date).toLocaleDateString() : 'Recent'}</span>
                                        <span>•</span>
                                        <span>{post.readTime || '5 min'} read</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">{post.title}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-3">{post.excerpt}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors border border-pink-500/30 px-5 py-2 hover:bg-pink-500/10">
                            View All Articles <i className="pi pi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    if (layout === 'terminal') {
        return (
            <section id="blog" className="py-20 relative overflow-hidden bg-slate-950/30">
                <div className="section-container">
                    <div className="max-w-4xl mx-auto font-mono">
                        <p className="text-green-500 mb-6">
                            <span className="text-green-400">~/blog</span>$ <span className="text-green-300">ls -t *.md | head -3</span>
                        </p>
                        <div className="border border-green-500/20 rounded-xl divide-y divide-green-500/10">
                            {latestPosts.map((post) => (
                                <Link key={post.slug} to={`/blog/${post.slug}`}
                                    className="flex items-center justify-between p-4 hover:bg-green-500/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-green-500/50 text-xs font-mono">{post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
                                        <span className="text-green-300 group-hover:text-green-200 transition-colors">{post.title}</span>
                                    </div>
                                    <span className="text-green-500/50 text-xs">{post.readTime || '5 min'}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors font-mono">
                                <span>$ cat more-posts.md</span> <i className="pi pi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (layout === '90s') {
        return (
            <section id="blog" className="py-20 relative overflow-hidden bg-[#1a0a2e]/30">
                <div className="section-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 font-mono" style={{textShadow: '3px 3px 0 #ff00ff'}}>
                            ╔══ Latest Articles ══╗
                        </h2>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        {latestPosts.map((post, i) => (
                            <Link key={post.slug} to={`/blog/${post.slug}`}
                                className="flex items-start gap-4 p-4 border-b-2 border-dashed border-purple-500/30 hover:bg-purple-900/20 transition-colors group">
                                <span className="text-yellow-400 text-lg shrink-0 mt-0.5">★</span>
                                <div className="flex-1">
                                    <h3 className="text-lime-300 font-bold group-hover:text-lime-200 transition-colors">{post.title}</h3>
                                    <p className="text-yellow-200/60 text-xs mt-1 font-mono">
                                        {post.date ? new Date(post.date).toLocaleDateString() : 'Recent'} | {post.readTime || '5 min'} read
                                    </p>
                                </div>
                                <span className="text-cyan-400 text-xs group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors font-mono border-2 border-orange-400/50 px-4 py-2 hover:bg-orange-900/20">
                            [ Read All Articles ]
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="blog" className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-indigo-900/10 to-transparent -z-10"></div>

            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        <span className="heading-gradient">Latest Insights</span>
                        <div className="max-w-[200px] mx-auto">
                            <GlowingLine />
                        </div>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Exploring the frontiers of web technology, sharing experiences,
                        and documenting the journey of building modern digital experiences.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-8">
                    {latestPosts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link to="/blog" className="btn-secondary group">
                        View All Articles
                        <i className="pi pi-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Blog;
