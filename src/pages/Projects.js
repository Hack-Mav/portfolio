import React, { useState, useEffect } from 'react';
import '../styles/Projects.css'; // Create a separate CSS file for styles

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch GitHub repositories
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Hack-Mav/repos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects-container">
      <h1 className="projects-header">My Projects</h1>
      <p className="projects-description">Here you can find details about my past and ongoing projects.</p>
      <div className="projects-grid">
        {loading && <p className="loading-text">Loading projects...</p>}
        {error && <p className="error-text">{error}</p>}
        {projects.length > 0 &&
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <h2 className="project-card-title">{project.name}</h2>
              <p className="project-card-description">
                {project.description || 'No description available.'}
              </p>
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-link"
                aria-label={`View ${project.name} on GitHub`}
              >
                View on GitHub
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Projects;
