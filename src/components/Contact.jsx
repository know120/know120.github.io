import GlowingLine from "./common/GlowingLine";
import ContactForm from "./ContactForm";
// import { socialLinks } from "../data/socialLinks";
// import { currentYear } from "../data/constants";

const Contact = () => {

    const currentYear = new Date().getFullYear();

    // Social links data
    const socialLinks = [
        { href: 'https://www.facebook.com/TheSujayHalder', icon: 'pi-facebook', label: 'Facebook' },
        { href: 'https://x.com/TheSujayHalder', icon: 'pi-twitter', label: 'Twitter' },
        { href: 'https://www.instagram.com/the_sujay_halder', icon: 'pi-instagram', label: 'Instagram' },
        { href: 'https://www.linkedin.com/in/sujayhalder', icon: 'pi-linkedin', label: 'LinkedIn' },
        { href: 'https://github.com/know120', icon: 'pi-github', label: 'GitHub' }
    ];


    return (
        <section id="contact" className="py-20">
            <div className={`section-container transition-all duration-1000 opacity-100 translate-y-0`}>
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
    );
};

export default Contact;