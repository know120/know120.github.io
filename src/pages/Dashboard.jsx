import { useInView } from 'react-intersection-observer';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ContactForm from '../components/ContactForm';
import GlowingLine from '../components/common/GlowingLine';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Tools from '../pages/Tools';

const Dashboard = () => {
  const currentYear = new Date().getFullYear();

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Skills Section */}
      {/* <SkillsSection /> */}

      {/* Experience Section */}
      <Experience />      

      {/* Projects Section */}
      <Projects />

      {/* Tools Section */}
      {/* <Tools /> */}

      {/* Blog Section */}
      <section id="blog" className="py-10 relative overflow-hidden" ref={blogRef}>
        <div className="absolute inset-0 bg-linear-to-b from-indigo-900/20 to-transparent -z-10"></div>
        <div className="section-container">
          <div className={`text-center transition-all duration-1000 ${blogInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
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

      {/* Contact Section */}
      <section id="contact" className="py-20" ref={contactRef}>
        <div className={`section-container transition-all duration-1000 ${contactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="heading-gradient">Get In Touch</span>
              <GlowingLine />
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