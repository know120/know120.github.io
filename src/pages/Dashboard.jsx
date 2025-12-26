import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ProjectCard from '../components/ProjectCard';
import ContactForm from '../components/ContactForm';
import SkillsSection from '../components/SkillsSection';
import Card from '../components/Card';

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [showAllProjects, setShowAllProjects] = useState(false);

  // Social links data
  const socialLinks = [
    { href: 'https://www.facebook.com/TheSujayHalder', icon: 'pi-facebook', label: 'Facebook' },
    { href: 'https://twitter.com/TheSujayHalder', icon: 'pi-twitter', label: 'Twitter' },
    { href: 'https://www.instagram.com/the_sujay_halder', icon: 'pi-instagram', label: 'Instagram' },
    { href: 'https://www.linkedin.com/in/sujayhalder', icon: 'pi-linkedin', label: 'LinkedIn' },
    { href: 'https://github.com/know120', icon: 'pi-github', label: 'GitHub' }
  ];

  // Intersection Observer for animations
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [blogRef, blogInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [contactRef, contactInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const expASL = {
    header: 'Alumnus Software Limited',
    title: 'Full Stack Developer',
    body: 'Developed a web application for one of the leading Tire manufacturing company using Angular 7,Bootstrap 5, .NET Framework, and SQLServer.',
    footer: 'July 2022 - Present'
  };

  const expDSS = {
    header: 'Divsoft Software Solutions',
    title: 'Software Engineer',
    body: 'Developed a Over Speed Detection System using CPP and OpenCV. That can receive the speed of the vehicle from a remote server using TCP Connection and Capture the image.',
    body: 'Developed a Over Speed Detection System using CPP and OpenCV. That can receive the speed of the vehicle from a remote server using TCP Connection and Capture the image.',
    footer: 'August 2021 - July 2022'
  };

  // Enhanced project data
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
    {
      title: 'Budget Evaluation System',
      description: 'Full-stack web application for budget management built with Angular, .NET Framework, and SQL Server.',
      technologies: ['Angular 7', 'TypeScript', '.NET Framework', 'SQL Server', 'Bootstrap'],
      image: 'https://via.placeholder.com/400x200/a855f7/ffffff?text=Budget+System',
      features: ['Budget tracking', 'Financial reports', 'User management', 'Dashboard analytics'],
      duration: '8 months',
      teamSize: '2 developers'
    },
    {
      title: 'Speed Detection System',
      description: 'Over-speed detection system using C++ and OpenCV with TCP connection for real-time vehicle monitoring.',
      technologies: ['C++', 'OpenCV', 'TCP/IP', 'Computer Vision'],
      image: 'https://via.placeholder.com/400x200/06b6d4/ffffff?text=Speed+Detection',
      liveDemo: null,
      github: 'https://github.com/know120/speed-detection-system',
      features: [
        'Real-time speed calculation',
        'Automatic image capture',
        'TCP server communication',
        'Alert system integration'
      ],
      duration: '6 months',
      teamSize: '3 developers'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Skills Section */}
      {/* <SkillsSection /> */}

      {/* Experience Section */}
      <section id="about" className="py-20 relative" ref={aboutRef}>
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="heading-gradient">Work Experience</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              My professional journey and the companies I've had the privilege to work with.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="glass-panel rounded-2xl p-6 hover:bg-slate-800/80 transition-colors">
              <Card
                header={expASL.header}
                title={expASL.title}
                body={expASL.body}
                footer={expASL.footer}
              />
            </div>
            <div className="glass-panel rounded-2xl p-6 hover:bg-slate-800/80 transition-colors">
              <Card
                header={expDSS.header}
                title={expDSS.title}
                body={expDSS.body}
                footer={expDSS.footer}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-900/50" ref={projectsRef}>
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="heading-gradient">Featured Projects</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A selection of projects that demonstrate my skills and passion for building impactful solutions.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 ${projectsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

      {/* Blog Section */}
      <section id="blog" className="py-20 relative overflow-hidden" ref={blogRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent -z-10"></div>
        <div className="section-container">
          <div className={`text-center transition-all duration-1000 ${blogInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              <span className="heading-gradient">Latest Insights</span>
            </h2>

            <div className="glass-panel max-w-3xl mx-auto rounded-2xl p-10 text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="pi pi-pencil text-4xl text-indigo-400"></i>
              </div>

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

      {/* Contact Section */}
      <section id="contact" className="py-20" ref={contactRef}>
        <div className={`section-container transition-all duration-1000 ${contactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="heading-gradient">Get In Touch</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Have a project in mind or just want to say hi? Feel free to reach out!
            </p>
          </div>

          <ContactForm />

          <div className="mt-20 pt-10 border-t border-slate-800 text-center">
            <div className="flex justify-center gap-6 mb-8">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
                  aria-label={link.label}
                >
                  <i className={`pi ${link.icon}`}></i>
                </a>
              ))}
            </div>

            <p className="text-slate-500 text-sm">
              © {currentYear} Sujay Halder. All rights reserved.
            </p>
            <p className="text-slate-600 text-xs mt-2">
              Built with React, Tailwind CSS & Modern Web Technologies
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;