import React from 'react';
import '../styles/Home.css'; // Import the external CSS file

const Home = () => {
  return (
    <div className="container">
      <Header />
      <Section title="About Me" content="I am a dedicated developer with expertise in [your skills, e.g., web development, React, Node.js]. I thrive on creating impactful solutions and innovative projects." />
      <FeaturedProjects />
      <Footer />
    </div>
  );
};

const Header = () => {
  return (
    <header className="header">
      <h1 className="title">Welcome to My Portfolio</h1>
      <p className="subtitle">Showcasing my work, skills, and passion for development.</p>
    </header>
  );
};

const Section = ({ title, content }) => {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      <p className="text">{content}</p>
    </section>
  );
};

const FeaturedProjects = () => {
  const projects = [
    { name: 'Project 1', description: '[Brief description]' },
    { name: 'Project 2', description: '[Brief description]' },
    { name: 'Project 3', description: '[Brief description]' },
  ];

  return (
    <section className="section">
      <h2 className="section-title">Featured Projects</h2>
      <div className="project-grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <h3 className="project-name">{project.name}</h3>
            <p className="project-description">{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        Connect with me on <a href="https://www.linkedin.com" className="link">LinkedIn</a> or check out my work on
        <a href="https://github.com" className="link"> GitHub</a>.
      </p>
      <div className="social-icons">
        <SocialIcon url="https://twitter.com" icon="/icons/twitter.png" alt="Twitter" />
        <SocialIcon url="https://facebook.com" icon="/icons/facebook.png" alt="Facebook" />
        <SocialIcon url="https://instagram.com" icon="/icons/instagram.png" alt="Instagram" />
      </div>
    </footer>
  );
};

const SocialIcon = ({ url, icon, alt }) => {
  return (
    <a href={url} className="icon-link">
      <img src={icon} alt={alt} className="icon" />
    </a>
  );
};

export default Home;
