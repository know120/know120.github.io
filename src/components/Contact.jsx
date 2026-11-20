import SectionHeading from './common/SectionHeading';
import ContactForm from './ContactForm';

const Contact = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: 'https://www.facebook.com/TheSujayHalder', icon: 'pi-facebook', label: 'Facebook' },
    { href: 'https://x.com/TheSujayHalder', icon: 'pi-twitter', label: 'Twitter' },
    { href: 'https://www.instagram.com/the_sujay_halder', icon: 'pi-instagram', label: 'Instagram' },
    { href: 'https://www.linkedin.com/in/sujayhalder', icon: 'pi-linkedin', label: 'LinkedIn' },
    { href: 'https://github.com/know120', icon: 'pi-github', label: 'GitHub' },
  ];

  return (
    <section id="contact" className="py-16">
      <div className="section-container">
        <SectionHeading
          index="04"
          eyebrow="Say hello"
          title="Get In Touch"
          description="Have a project in mind, a question, or just want to connect? My inbox is open."
        />

        <ContactForm />

        <div className="mt-20 border-t border-[var(--glass-border)] pt-10 text-center">
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-button h-11 w-11"
                aria-label={link.label}
              >
                <i className={`pi ${link.icon}`} />
              </a>
            ))}
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            © {currentYear} Sujay Halder · All rights reserved
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-tertiary)]/70">
            Built with React, Tailwind CSS & modern web technologies
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
