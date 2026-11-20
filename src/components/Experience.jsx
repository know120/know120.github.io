import GlowingLine from "./common/GlowingLine";
import Card from "./Card";

const Experience = () => {

    const expICAL = {
        header: 'ICRA Analytics Limited',
        title: 'Software Engineer II',
        body: 'Working on software solutions and data-driven products, contributing to the design, development, and delivery of reliable applications.',
        footer: 'January 2026 - Present'
    };

    const expASL = {
        header: 'Alumnus Software Limited',
        title: 'Full Stack Developer',
        body: 'Developed a web application for one of the leading Tire manufacturing company using Angular 7,Bootstrap 5, .NET Framework, and SQLServer.',
        footer: 'July 2022 - January 2026'
    };

    const expDSS = {
        header: 'Divsoft Software Solutions',
        title: 'Software Engineer',
        body: 'Developed a Over Speed Detection System using CPP and OpenCV. That can receive the speed of the vehicle from a remote server using TCP Connection and Capture the image.',
        footer: 'August 2021 - July 2022'
    };
    
    return (
        <section id="about" className="py-10 relative">
            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="heading-gradient">Work Experience</span>
                        <GlowingLine />
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        My professional journey and the companies I've had the privilege to work with.
                    </p>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 opacity-100 translate-y-0`}>
                    <div className="glass-panel glass-interactive rounded-3xl p-6">
                        <Card
                            header={expICAL.header}
                            title={expICAL.title}
                            body={expICAL.body}
                            footer={expICAL.footer}
                        />
                    </div>
                    <div className="glass-panel glass-interactive rounded-3xl p-6">
                        <Card
                            header={expASL.header}
                            title={expASL.title}
                            body={expASL.body}
                            footer={expASL.footer}
                        />
                    </div>
                    <div className="glass-panel glass-interactive rounded-3xl p-6">
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
    );
};

export default Experience;