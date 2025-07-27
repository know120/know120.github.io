import React from 'react';
import Card from '../components/Card';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const currentYear = new Date().getFullYear();

  const expASL = {
    header: 'Alumnus Software Limited',
    title: 'Full Stack Developer',
    body: 'Developed a web application for one of the leading Tire manufacturing company using Angular 7,Bootstrap 5, .NET Framework, and SQLServer.',
    footer: 'July 2022 - Present'
  };

  const expDSS = {
    header: 'Divsoft Software Solutions',
    title: 'Software Engineer',
    body: 'Developed a Over Speed Detection System using CPP and OpenCV. That can receive the speed of the vehicle from a remote server using TCP Connection and Capture the image of vehicle.',
    footer: 'August 2021 - July 2022'
  };

  const projDA = {
    header: 'Data Analysis',
    body: 'Analysis and Visualization of Political Spending on Facebook.',
    footer: 'Have a look'
  };

  const projML = {
    header: 'Machine Learning',
    body: 'Covid prediction using Chest X-Ray using Machine Learning.',
    footer: 'Have a look'
  };

  return (
    <div className="app">
      <Navigation />
      <section id="home" className="w-100 vh-100">
        <div className="container-fluid h-100 px-0 d-flex align-items-center">
          <div className="row d-flex align-items-center justify-content-center w-100 mx-0">
            <div className="col-12 col-md-6 col-lg-5 text-center mb-4 mb-md-0 px-4">
              <img
                className="profile-image rounded-circle img-fluid"
                src="assets/img/me.jpg"
                alt="Sujay Halder"
                style={{ maxWidth: '280px', width: '80%' }}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-7 text-center text-md-start px-4">
              <div className="hero-content">
                <h1 className="hero-title display-4 fw-bold mb-3">Hi, I'm Sujay</h1>
                <h2 className="hero-subtitle h3 mb-2">A Software Engineer</h2>
                {/* <h2 className="hero-subtitle h3 mb-4">Engineer</h2> */}
                <div className="hero-description d-none d-md-block">
                  <p className="lead">Passionate about creating innovative solutions and building amazing web experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="w-100 vh-100">
        <div className="container-fluid h-100 grid bg-secondary px-0 d-flex align-items-center">
          <div className="w-100 px-4">
            <h1 className="section-title text-center mb-5">Work Experience</h1>
            <div className="row g-4 mx-0 justify-content-center">
              <div className="col-12 col-lg-6 px-3">
                <Card
                  header={expASL.header}
                  title={expASL.title}
                  body={expASL.body}
                  footer={expASL.footer}
                />
              </div>
              <div className="col-12 col-lg-6 px-3">
                <Card
                  header={expDSS.header}
                  title={expDSS.title}
                  body={expDSS.body}
                  footer={expDSS.footer}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="w-100 vh-100">
        <div className="container-fluid h-100 gradient-grid px-0 d-flex align-items-center">
          <div className="w-100 px-4">
            <h1 className="section-title text-center mb-5">Projects</h1>
            <div className="row g-4 mx-0 justify-content-center">
              <div className="col-12 col-lg-6 px-3">
                <Card
                  header={projDA.header}
                  body={projDA.body}
                  footer={projDA.footer}
                />
              </div>
              <div className="col-12 col-lg-6 px-3">
                <Card
                  header={projML.header}
                  body={projML.body}
                  footer={projML.footer}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="blog" className="w-100 vh-100">
        <div className="container-fluid h-100 grid bg-secondary bg-gradient px-0 d-flex align-items-center">
          <div className="w-100 px-4">
            <h1 className="section-title text-center mb-4">Blogs</h1>
            <div className="text-center">
              <p className="lead">Coming Soon...</p>
              <p className="text-muted">Stay tuned for insights and tutorials on web development!</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="w-100 vh-100">
        <footer className="bg-dark text-center text-white w-100 h-100 d-flex align-items-center">
          <div className="container-fluid px-4 w-100">
            <div className="row mx-0">
              <div className="col-12">
                <h3 className="mb-4">Let's Connect</h3>
                <div className="social-links mb-4">
                  <a
                    className="btn btn-outline-light btn-social mx-2 mb-2"
                    href="https://www.facebook.com/TheSujayHalder"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="button"
                    aria-label="Facebook"
                  >
                    <i className="pi pi-facebook"></i>
                  </a>
                  <a
                    className="btn btn-outline-light btn-social mx-2 mb-2"
                    href="https://twitter.com/TheSujayHalder"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="button"
                    aria-label="Twitter"
                  >
                    <i className="pi pi-twitter"></i>
                  </a>
                  <a
                    className="btn btn-outline-light btn-social mx-2 mb-2"
                    href="https://www.instagram.com/the_sujay_halder"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="button"
                    aria-label="Instagram"
                  >
                    <i className="pi pi-instagram"></i>
                  </a>
                  <a
                    className="btn btn-outline-light btn-social mx-2 mb-2"
                    href="https://www.linkedin.com/in/sujayhalder"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="button"
                    aria-label="LinkedIn"
                  >
                    <i className="pi pi-linkedin"></i>
                  </a>
                  <a
                    className="btn btn-outline-light btn-social mx-2 mb-2"
                    href="https://github.com/know120"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="button"
                    aria-label="GitHub"
                  >
                    <i className="pi pi-github"></i>
                  </a>
                </div>
                <div className="footer-text">
                  <p className="mb-1">
                    © {currentYear}{' '}
                    <a className="text-white text-decoration-none" href="https://know120.github.io/">
                      Sujay Halder
                    </a>
                  </p>
                  <p className="text-muted small mb-0">Built with React & Bootstrap</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Dashboard;