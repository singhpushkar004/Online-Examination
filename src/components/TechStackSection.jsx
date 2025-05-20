import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaReact, FaNodeJs, FaDatabase, FaBootstrap, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiJavascript, SiMongodb,  SiExpress } from 'react-icons/si';

const techStack = [
  { icon: <FaHtml5 />, name: "HTML5" },
  { icon: <FaCss3Alt />, name: "CSS3" },
  { icon: <SiJavascript />, name: "JavaScript" },
  { icon: <FaBootstrap />, name: "Bootstrap" },
  { icon: <FaReact />, name: "React.js" },
  { icon: <FaNodeJs />, name: "Node.js" },
  { icon: <SiExpress />, name: "Express.js" },
  { icon: <SiMongodb />, name: "MongoDB" },
];

const TechStackSection = () => {
  return (
    <section id="techstack" className="tech-stack-section py-5">
      <Container>
        <h2 className="text-center text-white mb-5">Technology Stack</h2>
        <Row>
          {techStack.map((tech, index) => (
            <Col md={3} sm={4} xs={6} className="mb-4 text-center" key={index}>
              <Card className="tech-card shadow-sm animate__animated animate__zoomIn">
                <Card.Body>
                  <div className="tech-icon mb-2">{tech.icon}</div>
                  <Card.Text>{tech.name}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TechStackSection;
