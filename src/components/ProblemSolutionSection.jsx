import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const ProblemSolutionSection = () => {
  return (
    <section id="problems" className="problem-solution-section py-5">
      <Container>
        <h2 className="text-center mb-5">Problems in Existing System vs Proposed Solution</h2>
        <Row>
          <Col md={6} className="animate__animated animate__fadeInLeft">
            <Card className="problem-card shadow-sm">
              <Card.Body>
                <h4><FaTimesCircle className="text-danger me-2" /> Existing System Problems</h4>
                <ul>
                  <li>Manual working causes human errors</li>
                  <li>No centralized database, leading to data redundancy</li>
                  <li>Time-consuming entry and result processes</li>
                  <li>Difficulty in generating accurate reports</li>
                  <li>Complex and non-scalable working model</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="animate__animated animate__fadeInRight">
            <Card className="solution-card shadow-sm">
              <Card.Body>
                <h4><FaCheckCircle className="text-success me-2" /> Proposed System Features</h4>
                <ul>
                  <li>Fully automated process</li>
                  <li>Centralized, normalized database (no redundancy)</li>
                  <li>Instant results with minimal manual effort</li>
                  <li>Quick access to all reports and student data</li>
                  <li>Improved speed, accuracy, and scalability</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProblemSolutionSection;
