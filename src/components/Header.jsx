import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router';  // Correct import for react-router-dom
import img from "../assets/img/logo.png";
const Header = () => {
  return (
    <div className="ibt-header-wrapper position-sticky sticky-top">
      {/* NAVBAR */}
      <Navbar expand="lg" variant="dark" className="ibt-navbar">
        <Container>
          <Navbar.Brand className="fw-bold"><img src={img} alt="" style={{height:"50px"}}/></Navbar.Brand>
          <Navbar.Toggle aria-controls="ibt-navbar-nav" />
          <Navbar.Collapse id="ibt-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="text-decoration-none text-light">Home</Nav.Link>
              <Nav.Link as={Link} to="/about" className="text-decoration-none text-light">About</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-decoration-none text-light">Contact</Nav.Link>
              <Nav.Link as={Link} to="/signup" className="text-decoration-none text-light">Sign Up</Nav.Link>
              <Nav.Item>
                <Link to="/login">
                  <Button variant="outline-light" className="ms-2 border-0">Login</Button>
                </Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
