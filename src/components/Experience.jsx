import SectionHeading from './common/SectionHeading';
import Card from './Card';

const Experience = () => {
  const expICAL = {
    header: 'ICRA Analytics Limited',
    title: 'Software Engineer II',
    body: 'Working on software solutions and data-driven products, contributing to the design, development, and delivery of reliable applications.',
    footer: 'January 2026 - Present',
  };

  const expASL = {
    header: 'Alumnus Software Limited',
    title: 'Member of Technical Staff I',
    body: 'Developed a web application for one of the leading Tire manufacturing company using Angular 7, Bootstrap 5, .NET Framework, and SQLServer.',
    footer: 'July 2022 - January 2026',
  };

  const expDSS = {
    header: 'Divsoft Software Solutions',
    title: 'Software Engineer',
    body: 'Developed an Over Speed Detection System using C++ and OpenCV that receives vehicle speed from a remote server over TCP and captures images.',
    footer: 'August 2021 - July 2022',
  };

  const experiences = [expICAL, expASL, expDSS];

  return (
    <section id="about" className="relative py-16">
      <div className="section-container">
        <SectionHeading
          index="01"
          eyebrow="Where I've worked"
          title="Work Experience"
          description="A short timeline of the teams I've worked with and the problems I've helped solve."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <div key={experience.header} className="glass-panel glass-interactive rounded-sm p-6">
              <Card
                header={experience.header}
                title={experience.title}
                body={experience.body}
                footer={experience.footer}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
