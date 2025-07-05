import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-section text-white py-5">
      <Container>
        <Row>
          <Col md={3} className="mb-4">
            <h4>ExamPrep Project</h4>
            <p>A full-stack web application for managing ExamPrep efficiently and securely with automated reports and centralized data.</p>
          </Col>

          <Col md={3} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#modules">Modules</a></li>
              <li><a href="#problems">Problems</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#techstack">Technology</a></li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Contact</h5>
<<<<<<< HEAD
            <p><FaEnvelope className="me-2" /> pushkar.softpro.com</p>
            <p><FaMapMarkerAlt className="me-2" /> Lucknow </p>
          </Col>
          <Col md={3}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.3674831442177!2d80.96215187489541!3d26.923562159625238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd7e0637bf21%3A0x730fe46201abc68a!2sSoftpro%20Learning%20Center!5e0!3m2!1sen!2sin!4v1748362169766!5m2!1sen!2sin"   style={{border:"0"}}  loading="lazy" className='w-100'></iframe>
=======
            <p><FaEnvelope className="me-2" /> singhpushkar7830@gmail.com</p>
            <p><FaMapMarkerAlt className="me-2" /> 123 Lucknow india</p>
>>>>>>> a2210202bc449fc0eb863de010ff3c292f3310b1
          </Col>
        </Row>
        <hr className="footer-divider" />
        <p className="text-center mb-0">&copy; 2025 | All Rights Reserved Designed and Developed By Pushkar Singh</p>
      </Container>
    </footer>
  );
};

export default Footer;
