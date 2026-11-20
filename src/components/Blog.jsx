import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { posts } from "../utils/postUtils";
import GlowingLine from "./common/GlowingLine";
import BlogCard from "./BlogCard";


const Blog = () => {
    // Store latest posts from posts
    const [latestPosts, setLatestPosts] = useState([]);

    // Fetch latest posts
    useEffect(() => {
        setLatestPosts(posts.slice(0, 3));
    }, []);

    return (
        <section id="blog" className="py-20 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(124,140,255,0.12),transparent_70%)]"></div>

            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        <span className="heading-gradient">Latest Insights</span>
                        <div className="max-w-[200px] mx-auto">
                            <GlowingLine />
                        </div>
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Exploring the frontiers of web technology, sharing experiences,
                        and documenting the journey of building modern digital experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
