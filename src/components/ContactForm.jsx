import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const fieldClass = (key) =>
    `glass-input w-full px-4 py-3 text-sm ${errors[key] ? 'border-[var(--accent-rose)]' : ''}`;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="glass-panel rounded-sm p-8 md:p-10">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-[var(--glass-border)] pb-6">
          <div>
            <span className="eyebrow">Contact form</span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Send me a message
            </h3>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-tertiary)] sm:block">
            Response within 48h
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={fieldClass('name')}
                placeholder="Your full name"
              />
              {errors.name && <span className="text-xs text-[var(--accent-rose)]">{errors.name}</span>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={fieldClass('email')}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className="text-xs text-[var(--accent-rose)]">{errors.email}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={fieldClass('subject')}
              placeholder="What's this about?"
            />
            {errors.subject && <span className="text-xs text-[var(--accent-rose)]">{errors.subject}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`${fieldClass('message')} resize-none`}
              placeholder="Tell me about your project or just say hello..."
              rows="5"
            />
            {errors.message && <span className="text-xs text-[var(--accent-rose)]">{errors.message}</span>}
          </div>

          <button
            type="submit"
            className={`btn-primary w-full py-4 ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="pi pi-spin pi-spinner" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <i className="pi pi-send" />
                <span>Send Message</span>
              </>
            )}
          </button>

          {submitStatus === 'success' && (
            <div className="flex items-center gap-3 border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 p-4 text-sm text-[var(--accent-primary)]">
              <i className="pi pi-check-circle text-xl" />
              <span>Message sent successfully! I'll get back to you soon.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center gap-3 border border-[var(--accent-rose)]/30 bg-[var(--accent-rose)]/10 p-4 text-sm text-[var(--accent-rose)]">
              <i className="pi pi-exclamation-triangle text-xl" />
              <span>Something went wrong. Please try again later.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
