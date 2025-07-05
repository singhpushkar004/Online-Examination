import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    alert('Your message has been sent!');
    setFormData({ name: '', email: '', message: '' });
  } catch (err) {
    alert('Failed to send message');
  }
};


  return (
   <>
   <Header/>
     <div className="contact-page py-5 text-white">
      <Container>
        <h1 className="mb-4 text-center animate__animated animate__fadeInDown">Contact Us</h1>
        <Row>
          <Col md={6}>
            <h3>Contact Information</h3>
            <p>
              <FaEnvelope className="me-2" />
              Email: singhpushkar@gmail.com
            </p>
            <p>
              <FaPhoneAlt className="me-2" />
              Phone: +91 7830198385
            </p>
            <p>
              <FaMapMarkerAlt className="me-2" />
              Address: California University, Lucknow
            </p>
          </Col>

          <Col md={6}>
            <h3>Send Us a Message</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formMessage" className="mt-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your Message"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4">
                Send Message
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
    <Footer/>
   </>
  );
};

export default ContactPage;
