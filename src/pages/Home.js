import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to My Portfolio</h1>
        <p style={styles.subtitle}>Showcasing my work, skills, and passion for development.</p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>About Me</h2>
        <p style={styles.text}>
          I am a dedicated developer with expertise in [your skills, e.g., web development, React, Node.js]. I thrive on
          creating impactful solutions and innovative projects.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Projects</h2>
        <div style={styles.projectGrid}>
          <div style={styles.projectCard}>
            <h3 style={styles.projectName}>Project 1</h3>
            <p style={styles.projectDescription}>[Brief description]</p>
          </div>
          <div style={styles.projectCard}>
            <h3 style={styles.projectName}>Project 2</h3>
            <p style={styles.projectDescription}>[Brief description]</p>
          </div>
          <div style={styles.projectCard}>
            <h3 style={styles.projectName}>Project 3</h3>
            <p style={styles.projectDescription}>[Brief description]</p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Connect with me on <a href="https://www.linkedin.com" style={styles.link}>LinkedIn</a> or check out my work on
          <a href="https://github.com" style={styles.link}> GitHub</a>.
        </p>
        <div style={styles.socialIcons}>
          <a href="https://twitter.com" style={styles.iconLink}><img src="/icons/twitter.png" alt="Twitter" style={styles.icon}/></a>
          <a href="https://facebook.com" style={styles.iconLink}><img src="/icons/facebook.png" alt="Facebook" style={styles.icon}/></a>
          <a href="https://instagram.com" style={styles.iconLink}><img src="/icons/instagram.png" alt="Instagram" style={styles.icon}/></a>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    lineHeight: '1.6',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
    color: 'white',
    padding: '20px 0',
  },
  title: {
    fontSize: '2.5rem',
    margin: '10px 0',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#e0e0e0',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '10px',
    color: '#2575fc',
  },
  text: {
    fontSize: '1rem',
    color: '#444',
  },
  projectGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  projectCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '300px',
  },
  projectName: {
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  projectDescription: {
    fontSize: '1rem',
    color: '#666',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '20px 0',
    borderTop: '1px solid #ddd',
    backgroundColor: '#f1f1f1',
  },
  footerText: {
    fontSize: '0.9rem',
    marginBottom: '10px',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  iconLink: {
    display: 'inline-block',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  link: {
    color: '#007acc',
    textDecoration: 'none',
  },
};

export default Home;
