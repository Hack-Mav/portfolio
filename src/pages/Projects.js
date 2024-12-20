import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Hack-Mav/repos');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    color: '#333',
  };

  const headerStyle = {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#222',
  };

  const descriptionStyle = {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#555',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    justifyContent: 'center',
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
  };

  const linkStyle = {
    display: 'inline-block',
    marginTop: '1rem',
    color: '#007BFF',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>My Projects</h1>
      <p style={descriptionStyle}>Here you can find details about my past and ongoing projects.</p>
      <div style={gridStyle}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = cardHoverStyle.transform;
                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
              }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
                {project.name}
              </h2>
              <p style={{ fontSize: '1rem', color: '#666' }}>
                {project.description || 'No description available.'}
              </p>
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                View on GitHub
              </a>
            </div>
          ))
        ) : (
          <p>Loading projects...</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
