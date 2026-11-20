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
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Have a project in mind or just want to say hi? Feel free to reach out!
                    </p>
                </div>

                <ContactForm />

                <div className="mt-20 border-t border-white/10 pt-10 text-center">
                    <div className="mb-8 flex justify-center gap-3">
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="icon-button h-11 w-11"
                                aria-label={link.label}
                            >
                                <i className={`pi ${link.icon}`}></i>
                            </a>
                        ))}
                    </div>

                    <p className="text-sm text-[var(--text-tertiary)]">
                        © {currentYear} Sujay Halder. All rights reserved.
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-tertiary)]/70">
                        Built with React, Tailwind CSS & Modern Web Technologies
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Contact;