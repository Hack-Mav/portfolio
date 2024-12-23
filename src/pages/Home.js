import React, { useState, useEffect } from "react";
import "../styles/Home.css"; // Import the external CSS file

const Card = ({ title, description }) => (
  <div className="card">
    <h3 className="card-title">{title}</h3>
    <p className="card-description">{description || "No description available"}</p>
  </div>
);

const Header = () => (
  <header className="header">
    <h1 className="title">Welcome to My Portfolio</h1>
    <p className="subtitle">Showcasing my work, skills, and passion for development.</p>
  </header>
);

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://api.github.com/users/Hack-Mav/repos");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>;

  return (
    <section className="section">
      <h2 className="section-title">Featured Projects</h2>
      <div className="project-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} title={project.name} description={project.description} />
          ))
        ) : (
          <p className="no-projects">No projects to display</p>
        )}
      </div>
    </section>
  );
};

const SocialIcon = ({ url, icon, alt }) => (
  <a href={url} className="icon-link" target="_blank" rel="noopener noreferrer" aria-label={alt}>
    <img src={icon} alt={alt} className="icon" />
  </a>
);

const Footer = () => (
  <footer className="footer">
    <p className="footer-text">
      Connect with me on{" "}
      <a href="https://www.linkedin.com" className="link" target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>{" "}
      or check out my work on{" "}
      <a href="https://github.com" className="link" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      .
    </p>
    <div className="social-icons">
      <SocialIcon url="https://twitter.com" icon="/icons/twitter.png" alt="Twitter" />
      <SocialIcon url="https://facebook.com" icon="/icons/facebook.png" alt="Facebook" />
      <SocialIcon url="https://instagram.com" icon="/icons/instagram.jpg" alt="Instagram" />
    </div>
  </footer>
);

const Home = () => (
  <div className="container">
    <Header />
    <FeaturedProjects />
    <Footer />
  </div>
);

export default Home;
