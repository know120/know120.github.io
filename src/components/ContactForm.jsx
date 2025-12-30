import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-panel rounded-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Send me a message</h3>
          <p className="text-slate-400">I'd love to hear from you. Send me a message and I'll respond as soon as possible.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
                placeholder="Your full name"
              />
              {errors.name && <span className="text-xs text-red-400">{errors.name}</span>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-slate-300">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border ${errors.subject ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
              placeholder="What's this about?"
            />
            {errors.subject && <span className="text-xs text-red-400">{errors.subject}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-slate-300">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none`}
              placeholder="Tell me about your project or just say hello..."
              rows="5"
            ></textarea>
            {errors.message && <span className="text-xs text-red-400">{errors.message}</span>}
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-lg font-bold text-white transition-all transform hover:-translate-y-1 ${isSubmitting ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <i className="pi pi-spin pi-spinner"></i>
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <i className="pi pi-send"></i>
                <span>Send Message</span>
              </div>
            )}
          </button>

          {submitStatus === 'success' && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3 animate-fade-in">
              <i className="pi pi-check-circle text-xl"></i>
              <span>Message sent successfully! I'll get back to you soon.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 animate-fade-in">
              <i className="pi pi-exclamation-triangle text-xl"></i>
              <span>Something went wrong. Please try again later.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;