import React from "react";

// Shared Styles
const sectionStyle = {
  padding: "2rem",
  maxWidth: "800px",
  margin: "0 auto",
};

const headingStyle = {
  textAlign: "center",
  color: "#007BFF",
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "1rem",
};

// Reusable Card Component
const Card = ({ title, description, children }) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      backgroundColor: "#f9f9f9",
      marginBottom: "1rem",
      textAlign: "center",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }}
  >
    <h3 style={{ color: "#007BFF" }}>{title}</h3>
    {description && <p>{description}</p>}
    {children}
  </div>
);

// Hero Section Component
const HeroSection = () => (
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
);

// Mission Section Component
const MissionSection = () => (
  <section style={sectionStyle}>
    <h2 style={headingStyle}>My Mission</h2>
    <p style={{ lineHeight: "1.6", textAlign: "justify" }}>
      To develop efficient and scalable applications that solve real-world problems while leveraging cutting-edge technologies.
    </p>
    <p style={{ lineHeight: "1.6", marginTop: "1rem", textAlign: "justify" }}>
      I aim to bridge the gap between innovative ideas and technical implementation by creating solutions that are both robust and user-friendly.
    </p>
  </section>
);

// Skills Section Component
const skills = [
  { title: "ReactJS", description: "Front-End Development" },
  { title: "Golang", description: "Back-End Development" },
  { title: "MongoDB", description: "Database Management" },
];

const SkillsSection = () => (
  <section style={sectionStyle}>
    <h2 style={headingStyle}>Technical Skills</h2>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
        marginTop: "1rem",
      }}
    >
      {skills.map((skill, index) => (
        <Card key={index} title={skill.title} description={skill.description} />
      ))}
    </div>
  </section>
);

// Experience Section Component
const experiences = [
  {
    title: "Full-Stack Developer - Flyhigh EduTech Solutions",
    date: "May 2023 – Dec 2024",
    location: "Noida, India",
    duties: [
      "Developed end-to-end features using ReactJS and Golang.",
      "Managed MySQL and MongoDB databases, optimizing queries.",
      "Configured and deployed applications on Google Cloud Platform (GCP).",
    ],
  },
  {
    title: "Software Development Intern - Gao Tek Inc.",
    date: "Jan 2023 – Apr 2023",
    location: "Bangalore, India",
    duties: [
      "Researched requirements and integrated APIs with existing codebases.",
      "Collaborated with senior developers to debug and enhance libraries.",
    ],
  },
];

const ExperienceSection = () => (
  <section style={sectionStyle}>
    <h2 style={headingStyle}>Professional Experience</h2>
    {experiences.map((exp, index) => (
      <Card key={index} title={exp.title}>
        <p style={{ margin: "0.5rem 0", color: "#555" }}>
          <em>
            {exp.date} | {exp.location}
          </em>
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem", lineHeight: "1.8" }}>
          {exp.duties.map((duty, i) => (
            <li key={i}>{duty}</li>
          ))}
        </ul>
      </Card>
    ))}
  </section>
);

// Achievements Section Component
const achievements = [
  { title: "GATE 2022", description: "Secured 7384th Rank among 126,979 candidates." },
  { title: "HackerRank Badges", description: "Earned 7 badges, including 4 4-star badges." },
];

const AchievementsSection = () => (
  <section style={sectionStyle}>
    <h2 style={headingStyle}>Achievements</h2>
    {achievements.map((ach, index) => (
      <Card key={index} title={ach.title} description={ach.description} />
    ))}
  </section>
);

// Contact Section Component
const ContactSection = () => (
  <section style={sectionStyle}>
    <h2 style={headingStyle}>Contact Details</h2>
    <div style={{ textAlign: "left", lineHeight: "1.8", fontSize: "1.2rem" }}>
      <p>
        <strong>Phone:</strong> +91-9589883958
      </p>
      <p>
        <strong>Email:</strong> parthiv05022000@gmail.com
      </p>
      <p>
        <strong>LinkedIn:</strong>{" "}
        <a href="https://www.linkedin.com/in/parthiv-rawat" target="_blank" rel="noopener noreferrer">
          linkedin.com/in/parthiv-rawat
        </a>
      </p>
      <p>
        <strong>GitHub:</strong>{" "}
        <a href="https://github.com/Hack-Mav" target="_blank" rel="noopener noreferrer">
          github.com/Hack-Mav
        </a>
      </p>
    </div>
  </section>
);

// Call-to-Action Section Component
const CTASection = () => (
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
);

// Main About Component
const About = () => (
  <div style={{ fontFamily: "'Arial', sans-serif", color: "#333" }}>
    <HeroSection />
    <MissionSection />
    <SkillsSection />
    <ExperienceSection />
    <AchievementsSection />
    <ContactSection />
    <CTASection />
  </div>
);

export default About;
