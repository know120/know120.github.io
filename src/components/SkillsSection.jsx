const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Frontend",
      icon: "pi-desktop",
      skills: [
        { name: "React", level: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "TypeScript", level: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { name: "Tailwind CSS", level: 95, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
        { name: "Next.js", level: 80, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      ]
    },
    {
      title: "Backend",
      icon: "pi-server",
      skills: [
        { name: "Node.js", level: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Python", level: 80, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "PostgreSQL", level: 75, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { name: "GraphQL", level: 70, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
      ]
    },
    {
      title: "Tools & DevOps",
      icon: "pi-cog",
      skills: [
        { name: "Git", level: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { name: "Docker", level: 75, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { name: "AWS", level: 65, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        { name: "Figma", level: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="heading-gradient">Technical Skills</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and the tools I use to bring ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="glass-panel glass-interactive rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <i className={`pi ${category.icon} text-xl text-[var(--accent-secondary)]`}></i>
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx}>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={skill.icon} alt={skill.name} className="w-5 h-5" />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">{skill.name}</span>
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)]">{skill.level}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#6366f1,#7c8cff_45%,#64e3ff)] shadow-[0_0_18px_rgba(100,227,255,0.45)]"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;