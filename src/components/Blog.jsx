import GlowingLine from "./common/GlowingLine";

const Blog = () => {
    return (
        <section id="blog" className="py-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-indigo-900/20 to-transparent -z-10"></div>
            <div className="section-container">
                <div className={`text-center transition-all duration-1000 opacity-100 scale-100`}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        <span className="heading-gradient">Latest Insights</span>
                        <GlowingLine />
                    </h2>

                    <div className="glass-panel max-w-3xl mx-auto rounded-2xl p-10 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">Blog Coming Soon!</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            I'm working on a series of articles sharing my insights about web development,
                            best practices, and the latest technologies. Stay tuned!
                        </p>

                        <div className="bg-slate-900/50 rounded-xl p-6 mb-8 text-left">
                            <h4 className="text-indigo-300 font-semibold mb-4">Upcoming Topics:</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center text-slate-300">
                                    <i className="pi pi-check text-green-400 mr-3"></i>
                                    Modern React Development Patterns
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <i className="pi pi-check text-green-400 mr-3"></i>
                                    Performance Optimization Techniques
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <i className="pi pi-check text-green-400 mr-3"></i>
                                    Advanced CSS and Animations
                                </li>
                            </ul>
                        </div>

                        <button className="btn-primary">
                            <i className="pi pi-bell mr-2"></i>Notify Me When Ready
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;
