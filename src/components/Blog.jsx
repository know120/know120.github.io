import { Link } from "react-router-dom";
import GlowingLine from "./common/GlowingLine";
import BlogCard from "./BlogCard";

const latestPosts = [
    {
        slug: "add-bloging-with-markdown",
        title: "Bloging feature in Portfolio with Markdown",
        date: "2026-01-01",
        category: "Development",
        readTime: "8 min",
        excerpt: "Adding a blog to your portfolio is a great way to share your thoughts and document your learning journey.",
        image: null
    },
];

const Blog = () => {
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
