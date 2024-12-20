import React, { useState, useEffect } from 'react';

// Define styles outside the component for better readability and reusability
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#222',
  },
  description: {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#555',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    justifyContent: 'center',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
  },
  link: {
    display: 'inline-block',
    marginTop: '1rem',
    color: '#007BFF',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  cardDescription: {
    fontSize: '1rem',
    color: '#666',
  },
};

const Projects = () => {
  const [projects, setProjects] = useState([]);

  // Fetch GitHub repositories
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

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Projects</h1>
      <p style={styles.description}>Here you can find details about my past and ongoing projects.</p>
      <div style={styles.grid}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <h2 style={styles.cardTitle}>{project.name}</h2>
              <p style={styles.cardDescription}>
                {project.description || 'No description available.'}
              </p>
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
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
