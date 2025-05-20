import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaClock, FaShieldAlt, FaCheckDouble, FaEnvelopeOpenText, FaChartLine, FaUserTie } from 'react-icons/fa';

const benefits = [
  { icon: <FaClock />, title: "Time-Saving", desc: "Automates exam and evaluation processes for quick results." },
  { icon: <FaShieldAlt />, title: "Improved Integrity", desc: "Secure login and exam conduction improves credibility." },
  { icon: <FaCheckDouble />, title: "Accurate Testing", desc: "Objective questions and instant grading reduce errors." },
  { icon: <FaEnvelopeOpenText />, title: "Auto Email Reports", desc: "Results are instantly calculated and emailed." },
  { icon: <FaChartLine />, title: "Performance Insights", desc: "Detailed reports help analyze candidate competency." },
  { icon: <FaUserTie />, title: "Reduced Supervision Load", desc: "Frees up admin/staff to focus on more important tasks." },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="benefits-section py-5 text-white">
      <Container>
        <h2 className="text-center mb-5">Key Benefits of ORS System</h2>
        <Row>
          {benefits.map((benefit, index) => (
            <Col md={4} sm={6} className="mb-4" key={index}>
              <Card className="benefit-card h-100 text-center shadow-lg animate__animated animate__fadeInUp">
                <Card.Body>
                  <div className="benefit-icon mb-3">{benefit.icon}</div>
                  <Card.Title>{benefit.title}</Card.Title>
                  <Card.Text>{benefit.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default BenefitsSection;
