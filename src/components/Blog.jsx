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
