import React, { useState } from "react";
import "./Contact.css"; // Assuming you will create a separate CSS file for styling

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you for reaching out to us!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-description">
        We'd love to hear from you. Please fill out the form below to get in touch.
      </p>

      <div className="contact-form-container">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            label="Subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <FormTextArea
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
          <button type="submit" className="contact-submit-btn">
            Send Message
          </button>
        </form>
      </div>

      <div className="contact-info">
        <p>Phone: +91 9589883958</p>
        <p>Email: parthiv05022000@gmail.com</p>
        {/* <p>Address: 123 Example Street, City, Country</p> */}
      </div>
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="form-input-container">
    <label className="form-label">{label}</label>
    <input className="form-input" {...props} required />
  </div>
);

const FormTextArea = ({ label, ...props }) => (
  <div className="form-input-container">
    <label className="form-label">{label}</label>
    <textarea className="form-input" {...props} required />
  </div>
);

export default Contact;
