import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserLock, FaUserGraduate, FaQuestion, FaClipboardCheck, FaUserCog, FaChartBar } from 'react-icons/fa';

const modules = [
  { icon: <FaUserLock />, title: "Login Manager", desc: "Authenticate users with secure login credentials." },
  { icon: <FaUserGraduate />, title: "Examinee Info", desc: "Collect and manage detailed student data." },
  { icon: <FaQuestion />, title: "Question Bank", desc: "Store and manage objective-type questions with levels." },
  { icon: <FaClipboardCheck />, title: "Examination", desc: "Conduct online exams with timing and scoring." },
  { icon: <FaUserCog />, title: "Admin Panel", desc: "Manage users, questions, reports, and certifications." },
  { icon: <FaChartBar />, title: "Report Generation", desc: "Auto-generate exam performance reports." },
];

const ModulesSection = () => {
  return (
    <section id="modules" className="modules-section py-5">
      <Container>
        <h2 className="text-center mb-4">System Modules</h2>
        <Row>
          {modules.map((mod, index) => (
            <Col md={4} className="mb-4" key={index}>
              <Card className="module-card h-100 shadow-sm animate__animated animate__zoomIn">
                <Card.Body className="text-center">
                  <div className="module-icon mb-3">{mod.icon}</div>
                  <Card.Title>{mod.title}</Card.Title>
                  <Card.Text>{mod.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ModulesSection;
