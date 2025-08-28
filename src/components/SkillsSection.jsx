import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './SkillsSection.css';

const SkillsSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const skills = [
    { name: "React", level: 90, icon: "⚛️", color: "#61dafb" },
    { name: "Angular", level: 85, icon: "🅰️", color: "#dd0031" },
    { name: "JavaScript", level: 88, icon: "🟨", color: "#f7df1e" },
    { name: "TypeScript", level: 82, icon: "🔷", color: "#3178c6" },
    { name: "Node.js", level: 80, icon: "🟢", color: "#339933" },
    { name: "Python", level: 75, icon: "🐍", color: "#3776ab" },
    { name: ".NET", level: 78, icon: "🔵", color: "#512bd4" },
    { name: "SQL Server", level: 85, icon: "🗄️", color: "#cc2927" },
    { name: "MongoDB", level: 70, icon: "🍃", color: "#47a248" },
    { name: "Docker", level: 72, icon: "🐳", color: "#2496ed" },
    { name: "AWS", level: 68, icon: "☁️", color: "#ff9900" },
    { name: "Git", level: 88, icon: "📝", color: "#f05032" }
  ];

  return (
    <section id="skills" className="w-100 vh-100">
      <div className="container-fluid h-100 skills-grid px-0 d-flex align-items-center">
        <div className="w-100 px-4" ref={ref}>
          <h1 className="section-title text-center mb-5">Skills & Technologies</h1>
          <div className="skills-container">
            {skills.map((skill, index) => (
              <SkillCard 
                key={skill.name} 
                skill={skill} 
                index={index}
                inView={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillCard = ({ skill, index, inView }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setProgress(skill.level);
      }, index * 100);
      return () => clearTimeout(timer);
    }
  }, [inView, skill.level, index]);

  return (
    <div className="skill-card">
      <div className="skill-header">
        <span className="skill-icon">{skill.icon}</span>
        <span className="skill-name">{skill.name}</span>
        <span className="skill-percentage">{progress}%</span>
      </div>
      <div className="skill-bar">
        <div 
          className="skill-progress"
          style={{ 
            width: `${progress}%`,
            backgroundColor: skill.color,
            boxShadow: `0 0 10px ${skill.color}40`
          }}
        ></div>
      </div>
    </div>
  );
};

export default SkillsSection;