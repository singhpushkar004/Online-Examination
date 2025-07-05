import React, { useState } from "react";
import axios from "axios";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/send-email", formData);
      alert("Email sent successfully!");
    } catch (err) {
      alert("Failed to send email.");
    }
  };

  return (
    <form onSubmit={handleSend}>
      <input type="email" name="to" placeholder="Recipient Email" onChange={handleChange} required />
      <input type="text" name="subject" placeholder="Subject" onChange={handleChange} required />
      <textarea name="message" placeholder="Message" onChange={handleChange} required />
      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailForm;
