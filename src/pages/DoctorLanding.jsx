import React from 'react';
import { Link } from 'react-router-dom';

const DoctorLanding = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-teal-600">Dr. Rakesh Halder</span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#home" className="text-slate-600 hover:text-teal-600 font-medium">Home</a>
                        <a href="#about" className="text-slate-600 hover:text-teal-600 font-medium">About</a>
                        <a href="#services" className="text-slate-600 hover:text-teal-600 font-medium">Services</a>
                        <a href="#contact" className="text-slate-600 hover:text-teal-600 font-medium">Contact</a>
                    </nav>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full font-medium transition-colors">
                        Book Appointment
                    </button>
                    {/* Mobile menu button could go here */}
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="relative bg-teal-50 py-20 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center">
                    <div className="w-full lg:w-1/2 lg:pr-12 mt-10 lg:mt-0 z-10">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                            Compassionate Care for <span className="text-teal-600">Women's Health</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Specialized Gynecology & Obstetrics care dedicated to supporting you through every stage of life. From routine checkups to maternity care, your health is our priority.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform transform hover:-translate-y-1">
                                Schedule Visit
                            </button>
                            <button className="bg-white hover:bg-slate-50 text-teal-600 border border-teal-200 px-8 py-3 rounded-full font-bold shadow-sm transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 relative z-10">
                        {/* Placeholder for Doctor Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-teal-200 aspect-[4/3] flex items-center justify-center">
                            <span className="text-teal-800 text-xl font-medium">[Doctor Image Placeholder]</span>
                             {/* Decorative blob or shape could go behind */}
                        </div>
                    </div>
                     {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
                </div>
            </section>

            {/* Features / Intro */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Expert Care", icon: "🏥", desc: "Board-certified specialist with over 3 years of experience." },
                            { title: "Modern Facilities", icon: "✨", desc: "State-of-the-art clinic equipped with the latest technology." },
                            { title: "Patient Focused", icon: "❤️", desc: "Personalized treatment plans tailored to your unique needs." }
                        ].map((item, index) => (
                            <div key={index} className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">About Dr. Rakesh Halder</h2>
                        <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start gap-12">
                        <div className="w-full md:w-1/3">
                            <div className="aspect-[3/4] bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-inner">
                                [Portrait Image]
                            </div>
                        </div>
                        <div className="w-full md:w-2/3">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Dedicated to Women's Wellness</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Dr. Halder is a renowned Gynecologist and Obstetrician with a passion for empowering women through health education and compassionate care. She completed her residency at City General Hospital and has been practicing for over a decade.
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Her approach combines evidence-based medicine with a holistic view of patient well-being. She specializes in high-risk pregnancies, minimally invasive gynecologic surgery, and adolescent health.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    <span className="font-medium text-slate-700">MD in Obstetrics & Gynecology</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    <span className="font-medium text-slate-700">Certified Lactation Consultant</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    <span className="font-medium text-slate-700">Member of ACOG</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    <span className="font-medium text-slate-700">3+ Years Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
                        <p className="text-slate-600">Comprehensive care for every stage of your journey.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Prenatal Care", desc: "Complete care for you and your baby throughout pregnancy, ensuring a healthy journey." },
                            { title: "Gynecology", desc: "Routine screenings, pap smears, and management of reproductive health issues." },
                            { title: "Family Planning", desc: "Counseling and solutions for contraception and fertility planning." },
                            { title: "Menopause Management", desc: "Support and treatment for navigating the transition of menopause comfortably." },
                            { title: "Minimally Invasive Surgery", desc: "Advanced surgical techniques for faster recovery and less pain." },
                            { title: "Infertility Workup", desc: "Initial evaluation and guidance for couples facing fertility challenges." }
                        ].map((service, idx) => (
                            <div key={idx} className="p-8 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-colors border border-slate-100 group">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700">{service.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* CTA / Appointment */}
             <section id="contact" className="py-20 bg-teal-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to prioritize your health?</h2>
                    <p className="text-teal-100 text-lg mb-10 max-w-2xl mx-auto">
                        Book your appointment today. We are accepting new patients and look forward to caring for you.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-white text-teal-700 hover:bg-slate-100 px-8 py-3 rounded-full font-bold shadow-lg text-lg">
                            Book Appointment Now
                        </button>
                        <button className="bg-transparent border-2 border-white text-white hover:bg-teal-700 px-8 py-3 rounded-full font-bold text-lg transition-colors">
                            Call (555) 123-4567
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-bold text-white block mb-4">Dr. Rakesh Halder</span>
                        <p className="max-w-xs leading-relaxed">
                            Providing exceptional gynecological and obstetric care with dignity and respect.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#home" className="hover:text-teal-400 transition-colors">Home</a></li>
                            <li><a href="#about" className="hover:text-teal-400 transition-colors">About</a></li>
                            <li><a href="#services" className="hover:text-teal-400 transition-colors">Services</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact</h4>
                        <ul className="space-y-2">
                            <li>123 Medical Center Dr.</li>
                            <li>Suite 400</li>
                            <li>Cityville, ST 12345</li>
                            <li>contact@drHalder.com</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Dr. Rakesh Halder. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default DoctorLanding;
