import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Contact from '../components/Contact'
import VerticalLines from '../components/common/VerticalLines';

const Dashboard = () => {
  return (
    <div className="relative min-h-screen text-[var(--text-primary)]">
      {/* <VerticalLines /> */}
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
      <Blog />

      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default Dashboard;