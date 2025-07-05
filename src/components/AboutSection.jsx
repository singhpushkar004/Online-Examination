import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutSection = () => {
  return (
    <section id="about" className="about-section py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-section animate__animated animate__fadeInLeft">
            <h2>About ExamPrep</h2>
            <p>
              The ExamPrep system is a web-centric application designed to
              automate the entire examination process for universities and training institutions.
              It provides modules for student registration, question management, examination
              conduction, and automated report generation.
            </p>
            <ul>
              <li>Streamlined student registration</li>
              <li>Secure login and exam authentication</li>
              <li>Level-based question presentation</li>
              <li>Auto-evaluation with instant reports</li>
            </ul>
          </Col>
          <Col md={6} className="animate__animated animate__fadeInRight">
            <img
              src="https://img.freepik.com/free-vector/online-exams-abstract-concept-illustration_335657-3870.jpg" 
              alt="IBT Illustration"
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
