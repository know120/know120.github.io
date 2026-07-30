import GlowingLine from "./common/GlowingLine";
import Card from "./Card";
import { useLayout } from '../contexts/LayoutContext';

const Experience = () => {
    const { layout } = useLayout();

    const expASL = {
        header: 'Alumnus Software Limited',
        title: 'Full Stack Developer',
        body: 'Developed a web application for one of the leading Tire manufacturing company using Angular 7, Bootstrap 5, .NET Framework, and SQLServer.',
        footer: 'July 2022 - Present'
    };

    const expDSS = {
        header: 'Divsoft Software Solutions',
        title: 'Software Engineer',
        body: 'Developed a Over Speed Detection System using CPP and OpenCV. That can receive the speed of the vehicle from a remote server using TCP Connection and Capture the image.',
        footer: 'August 2021 - July 2022'
    };

    if (layout === 'neon') {
        return (
            <section id="about" className="py-10 relative">
                <div className="section-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-cyan-400">Work Experience</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            My professional journey and the companies I've had the privilege to work with.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[expASL, expDSS].map((exp, i) => (
                            <div key={i} className="border border-pink-500/30 bg-[#0d0221] p-6 shadow-[0_0_20px_rgba(255,0,255,0.1)] hover:shadow-[0_0_30px_rgba(255,0,255,0.2)] transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_6px_rgba(255,0,255,0.8)]"></div>
                                    <span className="text-xs font-semibold text-cyan-400">{exp.footer}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{exp.header}</h3>
                                <p className="text-pink-400 text-sm font-semibold mb-3">{exp.title}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{exp.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (layout === 'terminal') {
        return (
            <section id="about" className="py-10 relative">
                <div className="section-container">
                    <div className="max-w-4xl mx-auto font-mono">
                        <p className="text-green-500 mb-6">
                            <span className="text-green-400">~/experience</span>$ <span className="text-green-300">ls -la</span>
                        </p>
                        <div className="border border-green-500/20 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-slate-900/50 text-green-500/50 text-xs border-b border-green-500/20">
                                <span>PERIOD</span>
                                <span className="col-span-2">POSITION</span>
                                <span>COMPANY</span>
                            </div>
                            <div className="divide-y divide-green-500/10">
                                <div className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-green-500/5 transition-colors">
                                    <span className="text-green-400">2022-Present</span>
                                    <span className="col-span-2 text-green-300">{expASL.title}</span>
                                    <span className="text-green-400/70">{expASL.header}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-green-500/5 transition-colors">
                                    <span className="text-green-400">2021-2022</span>
                                    <span className="col-span-2 text-green-300">{expDSS.title}</span>
                                    <span className="text-green-400/70">{expDSS.header}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (layout === '90s') {
        return (
            <section id="about" className="py-10 relative">
                <div className="section-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 font-mono" style={{textShadow: '3px 3px 0 #ff00ff'}}>
                            ╔══ Work Experience ══╗
                        </h2>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <table className="w-full border-collapse border-2 border-cyan-400 font-mono text-sm">
                            <thead>
                                <tr className="bg-purple-900/50">
                                    <th className="border-2 border-cyan-400 p-3 text-yellow-300">Period</th>
                                    <th className="border-2 border-cyan-400 p-3 text-yellow-300">Position</th>
                                    <th className="border-2 border-cyan-400 p-3 text-yellow-300">Company</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { period: '2022 - Present', title: expASL.title, company: expASL.header, desc: expASL.body },
                                    { period: '2021 - 2022', title: expDSS.title, company: expDSS.header, desc: expDSS.body },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-purple-900/20 transition-colors">
                                        <td className="border-2 border-cyan-400 p-3 text-orange-400">{row.period}</td>
                                        <td className="border-2 border-cyan-400 p-3 text-lime-300">{row.title}</td>
                                        <td className="border-2 border-cyan-400 p-3 text-pink-300">{row.company}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-center">
                            <span className="text-cyan-400 text-xs font-mono animate-pulse">▼ Scroll down for more ▼</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="about" className="py-10 relative">
            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="heading-gradient">Work Experience</span>
                        <GlowingLine />
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        My professional journey and the companies I've had the privilege to work with.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel rounded-2xl p-6 hover:bg-slate-800/80 transition-colors">
                        <Card header={expASL.header} title={expASL.title} body={expASL.body} footer={expASL.footer} />
                    </div>
                    <div className="glass-panel rounded-2xl p-6 hover:bg-slate-800/80 transition-colors">
                        <Card header={expDSS.header} title={expDSS.title} body={expDSS.body} footer={expDSS.footer} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
