import GlowingLine from "./common/GlowingLine";
import ProjectCard from "./ProjectCard";

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
    // {
    //   title: 'Budget Evaluation System',
    //   description: 'Full-stack web application for budget management built with Angular, .NET Framework, and SQL Server.',
    //   technologies: ['Angular 7', 'TypeScript', '.NET Framework', 'SQL Server', 'Bootstrap'],
    //   image: 'https://via.placeholder.com/400x200/a855f7/ffffff?text=Budget+System',
    //   features: ['Budget tracking', 'Financial reports', 'User management', 'Dashboard analytics'],
    //   duration: '8 months',
    //   teamSize: '2 developers'
    // },
    // {
    //   title: 'Speed Detection System',
    //   description: 'Over-speed detection system using C++ and OpenCV with TCP connection for real-time vehicle monitoring.',
    //   technologies: ['C++', 'OpenCV', 'TCP/IP', 'Computer Vision'],
    //   image: 'https://via.placeholder.com/400x200/06b6d4/ffffff?text=Speed+Detection',
    //   liveDemo: null,
    //   github: 'https://github.com/know120/speed-detection-system',
    //   features: [
    //     'Real-time speed calculation',
    //     'Automatic image capture',
    //     'TCP server communication',
    //     'Alert system integration'
    //   ],
    //   duration: '6 months',
    //   teamSize: '3 developers'
    // }
  ];

const Projects = () => {

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

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 opacity-100 translate-y-0`}>
                    {projects.map((project, index) => (
                        <div key={`project-${index}`} className="h-full">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="https://github.com/know120"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-600 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                        <i className="pi pi-github"></i>
                        <span>View More on GitHub</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Projects;