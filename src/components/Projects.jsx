import GlowingLine from "./common/GlowingLine";
import ProjectCard from "./ProjectCard";
import { useLayout } from '../contexts/LayoutContext';

const projects = [
    {
      title: 'Political Spending Analysis',
      description: 'Comprehensive analysis and visualization of political advertising spending on Facebook using Python and data visualization.',
      technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter'],
      image: 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Data+Analysis',
      liveDemo: 'https://jovian.ai/know120/fb-ad-lib',
      github: 'https://github.com/know120/political-spending-analysis',
      features: ['Interactive visualizations', 'Statistical analysis', 'Trend identification', 'Automated reports'],
      duration: '3 months',
      teamSize: 'Solo Project'
    },
    {
      title: 'COVID-19 X-Ray Classifier',
      description: 'Machine learning model for COVID-19 detection using chest X-ray images with deep learning techniques.',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Keras', 'NumPy'],
      image: 'https://via.placeholder.com/400x200/8b5cf6/ffffff?text=ML+Project',
      liveDemo: 'https://know120.github.io/covid-xray-classifier',
      github: 'https://github.com/know120/covid-xray-ml',
      features: ['Deep learning CNN', '95% accuracy rate', 'Real-time processing', 'Web interface'],
      duration: '6 months',
      teamSize: '4 developers'
    },
  ];

const Projects = () => {
    const { layout } = useLayout();

    if (layout === 'terminal') {
        return (
            <section id="projects" className="py-10 bg-slate-950/50">
                <div className="section-container">
                    <div className="max-w-4xl mx-auto font-mono">
                        <p className="text-green-500 mb-6">
                            <span className="text-green-400">~/projects</span>$ <span className="text-green-300">find . -type f -name "*.featured"</span>
                        </p>
                        <div className="space-y-4">
                            {projects.map((project, index) => (
                                <div key={index} className="border border-green-500/20 rounded-xl p-5 hover:bg-green-500/5 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-green-300 font-bold text-lg">[{project.title}]</h3>
                                        <span className="text-xs text-green-500/50">{project.duration}</span>
                                    </div>
                                    <p className="text-green-300/60 text-sm mb-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.technologies.map((tech, i) => (
                                            <span key={i} className="text-xs text-green-400/70 bg-green-500/10 px-2 py-1 rounded">{tech}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:text-green-300 transition-colors"><i className="pi pi-external-link mr-1"></i> demo</a>}
                                        {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:text-green-300 transition-colors"><i className="pi pi-github mr-1"></i> source</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (layout === '90s') {
        return (
            <section id="projects" className="py-10 bg-[#1a0a2e]/50">
                <div className="section-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 font-mono" style={{textShadow: '3px 3px 0 #ff00ff'}}>
                            ╔══ Projects ══╗
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project, index) => (
                            <div key={index} className="border-4 border-orange-400 bg-[#1a0a2e] p-5 shadow-[8px_8px_0_rgba(255,102,0,0.3)]">
                                <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-cyan-400 pb-2">
                                    <h3 className="text-lime-300 font-bold text-lg">{project.title}</h3>
                                    <span className="text-xs text-pink-400 font-mono">{project.duration}</span>
                                </div>
                                <p className="text-yellow-200/70 text-sm mb-3">{project.description}</p>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {project.technologies.map((tech, i) => (
                                        <span key={i} className="text-xs text-cyan-300 bg-cyan-900/30 px-2 py-0.5 font-mono">{tech}</span>
                                    ))}
                                </div>
                                <div className="flex gap-3 pt-2 border-t-2 border-dashed border-purple-500/40">
                                    {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300 font-mono">[ Demo ]</a>}
                                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">[ Source ]</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="py-10 bg-slate-900/50">
            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="heading-gradient">Featured Projects</span>
                        <GlowingLine />
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        A selection of projects that demonstrate my skills and passion for building impactful solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <div key={`project-${index}`} className="h-full">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a href="https://github.com/know120" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-600 hover:border-indigo-500 hover:text-indigo-400 transition-colors">
                        <i className="pi pi-github"></i>
                        <span>View More on GitHub</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Projects;
