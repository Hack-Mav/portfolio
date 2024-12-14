import React from "react";
import "aos/dist/aos.css";

const About = () => {
  return (
    <div style={{ fontFamily: "'Arial', sans-serif", color: "#333" }}>
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          background: "linear-gradient(to right, #007BFF, #00BFFF)",
          color: "white",
          borderRadius: "10px",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>About Me</h1>
        <p style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>
          Full-Stack Developer | Problem Solver | Innovator
        </p>
      </div>

      {/* Introduction Section */}
      <div
        data-aos="fade-up"
        style={{ textAlign: "center", padding: "1rem", maxWidth: "800px", margin: "0 auto" }}
      >
        <h2 style={{ color: "#007BFF", fontSize: "2rem", fontWeight: "bold", textAlign: "center", padding: "5px" }}>My Mission</h2>
        <p style={{ lineHeight: "1.6", textAlign: "left" }}>
          To develop efficient and scalable applications that solve real-world problems while leveraging cutting-edge technologies.
        </p>
        <p style={{ lineHeight: "1.6", marginTop: "1rem", textAlign: "left" }}>
          I aim to bridge the gap between innovative ideas and technical implementation by creating solutions that are both robust and user-friendly. 
          My mission is to continuously learn and evolve with the ever-changing tech landscape, ensuring that I stay ahead in providing the most 
          efficient tools and applications to clients and businesses worldwide.
        </p>
      </div>


      {/* Skills Section */}
      <section style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#007BFF", fontSize: "2rem", fontWeight: "bold" }}>Technical Skills</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ color: "#007BFF" }}>ReactJS</h3>
            <p>Front-End Development</p>
          </div>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ color: "#007BFF" }}>Golang</h3>
            <p>Back-End Development</p>
          </div>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ color: "#007BFF" }}>MongoDB</h3>
            <p>Database Management</p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#007BFF", fontSize: "2rem", fontWeight: "bold", padding: "5px" }}>Professional Experience</h2>
        <div style={{ marginBottom: "1rem" }}>
          <h3>Full-Stack Developer - Flyhigh EduTech Solutions</h3>
          <p style={{ margin: "0.5rem 0", color: "#555" }}><em>May 2023 – Dec 2024 | Noida, India</em></p>
          <ul style={{ listStyleType: "disc", paddingLeft: "2rem", lineHeight: "1.8" }}>
            <li>Developed end-to-end features using ReactJS and Golang.</li>
            <li>Managed MySQL and MongoDB databases, optimizing queries.</li>
            <li>Configured and deployed applications on Google Cloud Platform (GCP).</li>
          </ul>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <h3>Software Development Intern - Gao Tek Inc.</h3>
          <p style={{ margin: "0.5rem 0", color: "#555" }}><em>Jan 2023 – Apr 2023 | Bangalore, India</em></p>
          <ul style={{ listStyleType: "disc", paddingLeft: "2rem", lineHeight: "1.8" }}>
            <li>Researched requirements and integrated APIs with existing codebases.</li>
            <li>Collaborated with senior developers to debug and enhance libraries.</li>
          </ul>
        </div>
      </section>

      {/* Achievements Section */}
      <section style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#007BFF", fontSize: "2rem", fontWeight: "bold", padding: "5px" }}>Achievements</h2>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            marginBottom: "1rem",
          }}
        >
          <h3>GATE 2022</h3>
          <p>Secured 7384th Rank among 126,979 candidates.</p>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            marginBottom: "1rem",
          }}
        >
          <h3>HackerRank Badges</h3>
          <p>Earned 7 badges, including 4 4-star badges.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#007BFF", fontSize: "2rem", fontWeight: "bold" }}>Contact Details</h2>
        <div style={{ textAlign: "left", lineHeight: "1.8", fontSize: "1.2rem" }}>
          <p><strong>Phone:</strong> +91-9589883958</p>
          <p><strong>Email:</strong> parthiv05022000@gmail.com</p>
          <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/parthiv-rawat" target="_blank" rel="noopener noreferrer">linkedin.com/in/parthiv-rawat</a></p>
          <p><strong>GitHub:</strong> <a href="https://github.com/Hack-Mav" target="_blank" rel="noopener noreferrer">github.com/Hack-Mav</a></p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "2rem" }}>
        <a
          href="/path-to-resume.pdf"
          download
          style={{
            textDecoration: "none",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "1rem",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
        >
          Download Resume
        </a>
      </div>
    </div>
  );
};

export default About;
