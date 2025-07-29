import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Card from '../components/Card';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import SkillsSection from '../components/SkillsSection';
import ProjectCard from '../components/ProjectCard';
import ContactForm from '../components/ContactForm';
import LoadingScreen from '../components/LoadingScreen';


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
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [blogRef, blogInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [contactRef, contactInView] = useInView({ threshold: 0.3, triggerOnce: true });

  const expASL = {
    header: 'Alumnus Software Limited',
    title: 'Full Stack Developer',
    body: 'Developed a web application for one of the leading Tire manufacturing company using Angular 7,Bootstrap 5, .NET Framework, and SQLServer.',
    footer: 'July 2022 - Present'
  };

  const expDSS = {
    header: 'Divsoft Software Solutions',
    title: 'Software Engineer',
    body: 'Developed a Over Speed Detection System using CPP and OpenCV. That can receive the speed of the vehicle from a remote server using TCP Connection and Capture the image of vehicle.',
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

  // if (isLoading) {
  //   return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  // }

  return (
    <div className="app">
      <Navigation />

      {/* Enhanced Hero Section */}
      <HeroSection />

      {/* Skills Section */}
      {/* <SkillsSection /> */}

      {/* Enhanced About/Experience Section */}
      <section id="about" className="w-100 vh-100" ref={aboutRef}>
        <div className={`container-fluid h-100 grid bg-secondary px-0 d-flex align-items-center ${aboutInView ? 'animate-in' : ''}`}>
          <div className="w-100 px-4">
            <h1 className="section-title text-center mb-5">Work Experience</h1>
            <div className="row g-4 mx-0 justify-content-center">
              <div className="col-12 col-lg-6 px-3">
                <Card
                  header={expASL.header}
                  title={expASL.title}
                  body={expASL.body}
                  footer={expASL.footer}
                />
                </div>
              <div className="col-12 col-lg-6 px-3">
                <Card
                  header={expDSS.header}
                  title={expDSS.title}
                  body={expDSS.body}
                  footer={expDSS.footer}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`w-100 ${showAllProjects ? 'vh-auto' : 'vh-100'}`} ref={projectsRef}>
        <div className={`container-fluid ${showAllProjects ? 'py-5' : 'h-100'} projects-section px-0 d-flex align-items-center ${projectsInView ? 'animate-in' : ''}`}>
          <div className="w-100 px-4">
            <h1 className="section-title text-center mb-5">
              {showAllProjects ? `All Projects (${projects.length})` : 'Featured Projects'}
            </h1>

            <div className="row g-4 mx-0 justify-content-center">
              {projects.length > 0 ? (
                (showAllProjects ? projects : projects.slice(0, 2)).map((project, index) => (
                  <div
                    key={`project-${index}`}
                    className={`col-12 ${showAllProjects ? 'col-md-6 col-xl-4' : 'col-lg-6'} px-3 mb-4`}
                    style={{ minHeight: '400px' }}
                  >
                    <ProjectCard project={project} />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p className="text-white">No projects found</p>
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              {!showAllProjects ? (
                <button
                  className="btn btn-outline-light btn-lg"
                  onClick={() => setShowAllProjects(true)}
                >
                  <i className="pi pi-eye me-2"></i>
                  View All Projects ({projects.length})
                </button>
              ) : (
                <div className="btn-group-projects">
                  <button
                    className="btn btn-outline-light btn-lg"
                    onClick={() => setShowAllProjects(false)}
                  >
                    <i className="pi pi-arrow-up me-2"></i>
                    Show Featured Only
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => window.open('https://github.com/know120', '_blank')}
                  >
                    <i className="pi pi-github me-2"></i>
                    View GitHub Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="w-100 vh-100" ref={blogRef}>
        <div className={`container-fluid h-100 grid bg-secondary bg-gradient px-0 d-flex align-items-center ${blogInView ? 'animate-in' : ''}`}>
          <div className="w-100 px-4">
            <h1 className="section-title text-center mb-4">Latest Insights</h1>
            <div className="text-center">
              <div className="blog-preview">
                <i className="pi pi-file-edit" style={{ fontSize: '4rem', color: '#6366f1', marginBottom: '2rem' }}></i>
                <h3 className="mb-3">Blog Coming Soon!</h3>
                <p className="lead mb-4">Sharing insights about web development, best practices, and latest technologies.</p>
                <div className="upcoming-topics">
                  <h4 className="mb-3">Upcoming Topics:</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">🚀 Modern React Development Patterns</li>
                    <li className="mb-2">⚡ Performance Optimization Techniques</li>
                    <li className="mb-2">🎨 Advanced CSS and Animations</li>
                    <li className="mb-2">🔧 Full-Stack Development Best Practices</li>
                  </ul>
                </div>
                <button className="btn btn-primary btn-lg mt-3">
                  <i className="pi pi-bell me-2"></i>
                  Notify Me When Ready
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-100 vh-100" ref={contactRef}>
        <div className={`container-fluid bg-dark px-0 h-100 d-flex flex-column justify-content-center ${contactInView ? 'animate-in' : ''}`}>
          <div className="w-100 px-4">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8">
                {/* <h1 className="section-title text-center mb-3 text-white">Get In Touch</h1> */}
                <ContactForm />
              </div>
            </div>

            <div className="text-center mt-3">
              <div className="social-links mb-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    className="btn btn-outline-light btn-social mx-2 mb-2"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <i className={`pi ${link.icon}`}></i>
                  </a>
                ))}
              </div>
              <div className="footer-text text-white">
                <p className="mb-1">
                  © {currentYear}{' '}
                  <a className="text-white text-decoration-none" href="https://know120.github.io/">
                    Sujay Halder
                  </a>
                </p>
                <p className="text-muted small mb-0">Built with React, Bootstrap & Modern Web Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;