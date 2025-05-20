import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-section text-white py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h4>ORS Project</h4>
            <p>A full-stack web application for managing Online Result System efficiently and securely with automated reports and centralized data.</p>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#modules">Modules</a></li>
              <li><a href="#problems">Problems</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#techstack">Technology</a></li>
            </ul>
          </Col>

          <Col md={4}>
            <h5>Contact</h5>
            <p><FaEnvelope className="me-2" /> singhpushkar@gmail.com</p>
            <p><FaMapMarkerAlt className="me-2" /> 123 Lucknow india</p>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <p className="text-center mb-0">&copy; 2025 | All Rights Reserved Designed and Developed By Pushkar Singh</p>
      </Container>
    </footer>
  );
};

export default Footer;
