import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '../components/Header';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);

  const navigate = useNavigate();

  // Generate a simple CAPTCHA (5 characters)
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(code);
    setUserCaptcha('');
    setCaptchaValid(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'userCaptcha') {
      setUserCaptcha(value.toUpperCase());
      setCaptchaValid(value.toUpperCase() === captcha);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValid) {
      alert("CAPTCHA is incorrect.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user, message } = res.data;

      localStorage.setItem("ibtToken", token);
      localStorage.setItem("ibtUser", JSON.stringify(user));
      localStorage.setItem("branchId", JSON.stringify(user.branchId));

      alert(message);
      navigate('/student/');
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="card border-0 shadow-lg">
              <h2 className="text-center my-4 cursive"><u>User Login</u></h2>
              <Form onSubmit={handleSubmit} className='p-4'>

                {/* Email */}
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* CAPTCHA */}
                <Form.Group className="mt-4">
                  <Form.Label>Enter CAPTCHA</Form.Label>
                  <div style={{
                    backgroundColor: '#f1f1f1',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    letterSpacing: '6px',
                    textAlign: 'center',
                    padding: '10px',
                    marginBottom: '10px',
                    border: '2px dashed #999',
                    borderRadius: '5px',
                    userSelect: 'none',
                    fontFamily: 'monospace'
                  }}>
                    {captcha}
                  </div>
                  <Form.Control
                    type="text"
                    name="userCaptcha"
                    placeholder="Type CAPTCHA here"
                    value={userCaptcha}
                    onChange={handleChange}
                    required
                  />
                  <Button variant="link" className="p-0 mt-1" onClick={generateCaptcha}>
                    🔄 Refresh CAPTCHA
                  </Button>
                  {!captchaValid && userCaptcha && (
                    <div className="text-danger small mt-1">CAPTCHA does not match</div>
                  )}
                </Form.Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="mt-4 w-100"
                  disabled={!captchaValid}
                >
                  Login
                </Button>

                <p className="text-center mt-3">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default LoginPage;
