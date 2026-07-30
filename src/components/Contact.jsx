import GlowingLine from "./common/GlowingLine";
import ContactForm from "./ContactForm";
import { useLayout } from '../contexts/LayoutContext';

const Contact = () => {
    const { layout } = useLayout();

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { href: 'https://www.facebook.com/TheSujayHalder', icon: 'pi-facebook', label: 'Facebook' },
        { href: 'https://x.com/TheSujayHalder', icon: 'pi-twitter', label: 'Twitter' },
        { href: 'https://www.instagram.com/the_sujay_halder', icon: 'pi-instagram', label: 'Instagram' },
        { href: 'https://www.linkedin.com/in/sujayhalder', icon: 'pi-linkedin', label: 'LinkedIn' },
        { href: 'https://github.com/know120', icon: 'pi-github', label: 'GitHub' }
    ];

    if (layout === 'neon') {
        return (
            <section id="contact" className="py-20">
                <div className="section-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-cyan-400">Get In Touch</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Have a project in mind or just want to say hi?
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto">
                        <div className="border border-pink-500/30 bg-[#0d0221] p-8 shadow-[0_0_20px_rgba(255,0,255,0.1)]">
                            <ContactForm />
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-pink-500/20">
                        <div className="flex justify-center gap-6 mb-6">
                            {socialLinks.map((link, index) => (
                                <a key={index} href={link.href} target="_blank" rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all"
                                    aria-label={link.label}>
                                    <i className={`pi ${link.icon}`}></i>
                                </a>
                            ))}
                        </div>
                        <p className="text-slate-500 text-sm text-center">© {currentYear} Sujay Halder</p>
                    </div>
                </div>
            </section>
        );
    }

    if (layout === 'terminal') {
        return (
            <section id="contact" className="py-20">
                <div className="section-container">
                    <div className="max-w-4xl mx-auto font-mono">
                        <p className="text-green-500 mb-6">
                            <span className="text-green-400">~/contact</span>$ <span className="text-green-300">cat contact.txt</span>
                        </p>
                        <div className="border border-green-500/20 rounded-xl p-6 text-sm space-y-3">
                            <p><span className="text-green-500/50">email   :</span> <a href="mailto:sujay@example.com" className="text-green-300 hover:text-green-200">sujay@example.com</a></p>
                            <p><span className="text-green-500/50">github  :</span> <a href="https://github.com/know120" target="_blank" rel="noopener noreferrer" className="text-green-300 hover:text-green-200">know120</a></p>
                            <p><span className="text-green-500/50">linkedin:</span> <a href="https://linkedin.com/in/sujayhalder" target="_blank" rel="noopener noreferrer" className="text-green-300 hover:text-green-200">sujayhalder</a></p>
                            <p><span className="text-green-500/50">twitter :</span> <a href="https://twitter.com/TheSujayHalder" target="_blank" rel="noopener noreferrer" className="text-green-300 hover:text-green-200">@TheSujayHalder</a></p>
                            <div className="pt-3 mt-3 border-t border-green-500/10">
                                <p className="text-green-500/50 text-xs">© {currentYear} Sujay Halder. Built with React, Tailwind CSS & Modern Web Technologies.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (layout === '90s') {
        return (
            <section id="contact" className="py-20">
                <div className="section-container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 font-mono" style={{textShadow: '3px 3px 0 #ff00ff'}}>
                            ╔══ Get In Touch ══╗
                        </h2>
                        <p className="text-cyan-400 text-sm font-mono mt-2">Email me! I don't bite! ★</p>
                    </div>
                    <div className="max-w-2xl mx-auto border-4 border-orange-400 bg-[#1a0a2e] p-1 shadow-[8px_8px_0_rgba(255,102,0,0.3)]">
                        <div className="border-2 border-dashed border-cyan-400 p-6">
                            <div className="space-y-3 font-mono text-sm">
                                {[
                                    { label: 'Email', value: 'sujay@example.com', href: 'mailto:sujay@example.com' },
                                    { label: 'GitHub', value: 'know120', href: 'https://github.com/know120' },
                                    { label: 'LinkedIn', value: 'sujayhalder', href: 'https://linkedin.com/in/sujayhalder' },
                                    { label: 'Twitter', value: '@TheSujayHalder', href: 'https://twitter.com/TheSujayHalder' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-yellow-400 w-16 shrink-0">&lt;{item.label}/&gt;</span>
                                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-lime-300 hover:text-lime-200 transition-colors">{item.value}</a>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t-2 border-dashed border-purple-500/40 text-center">
                                <span className="text-pink-400 text-xs font-mono">✦ {currentYear} Sujay Halder ✦</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const footer = (
        <div className="mt-20 pt-10 border-t border-slate-800 text-center">
            <div className="flex justify-center gap-6 mb-8">
                {socialLinks.map((link, index) => (
                    <a key={index} href={link.href} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
                        aria-label={link.label}>
                        <i className={`pi ${link.icon}`}></i>
                    </a>
                ))}
            </div>
            <p className="text-slate-500 text-sm">© {currentYear} Sujay Halder. All rights reserved.</p>
            <p className="text-slate-600 text-xs mt-2">Built with React, Tailwind CSS & Modern Web Technologies</p>
        </div>
    );

    return (
        <section id="contact" className="py-20">
            <div className="section-container">
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
                {footer}
            </div>
        </section>
    );
};

export default Contact;
