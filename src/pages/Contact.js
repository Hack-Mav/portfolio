import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add logic to send the data to your backend or email service
    alert("Thank you for reaching out to us!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Arial', sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Contact Us</h1>
      <p style={{ textAlign: "center", marginBottom: "2rem", color: "#555" }}>
        We'd love to hear from you. Please fill out the form below to get in touch.
      </p>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#f9f9f9",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Subject:
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Message:
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                height: "100px",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
          >
            Send Message
          </button>
        </form>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          color: "#777",
          fontSize: "0.9rem",
        }}
      >
        <p>Phone: +91 9589883958</p>
        <p>Email: parthiv05022000@gmail.com</p>
        {/* <p>Address: 123 Example Street, City, Country</p> */}
      </div>
    </div>
  );
};

export default Contact;
