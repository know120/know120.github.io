import SectionHeading from './common/SectionHeading';
import ProjectCard from './ProjectCard';

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
    teamSize: 'Solo Project',
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
    teamSize: '4 developers',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="relative py-16">
      <div className="section-container">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Featured Projects"
          description="A small selection of projects that show how I approach data, machine learning, and full-stack problems."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} number={String(index + 1).padStart(2, '0')} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/know120"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
          >
            <i className="pi pi-github" />
            <span>View More on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
