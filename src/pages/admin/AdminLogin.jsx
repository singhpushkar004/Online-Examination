import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Captcha validation
    if (captchaInput !== captcha) {
      alert("Invalid CAPTCHA");
      generateCaptcha(); // refresh
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);
      const { user, message } = res.data;
      if (message === "Login successful") {
        window.alert("Login Success");
        localStorage.setItem('admin', user._id);
        navigate('/admin/');
      } else {
        window.alert("Something Went Wrong");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
           <div className="card border-0 shadow-lg">
             <h2 className="text-center mb-4 cursive">Admin Login</h2>
            <Form onSubmit={handleSubmit} className='p-5'>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>

              {/* CAPTCHA Section */}
              <Form.Group className="mt-3">
                <Form.Label>Enter CAPTCHA</Form.Label>
                <div
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: '10px',
                    fontFamily: 'monospace',
                    fontSize: '24px',
                    letterSpacing: '5px',
                    textAlign: 'center',
                    border: '1px dashed #ccc',
                    borderRadius: '8px',
                    userSelect: 'none'
                  }}
                >
                  {captcha}
                </div>
                <Button variant="link" size="sm" onClick={generateCaptcha}>
                  Refresh Captcha 🔄
                </Button>
                <Form.Control
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                  placeholder="Type the text shown above"
                />
              </Form.Group>

              <Button type="submit" className="mt-4 w-100">Login</Button>
              <p className="text-center mt-3">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </Form>
           </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default AdminLogin;
