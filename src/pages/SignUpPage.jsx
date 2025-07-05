import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [branch, setBranch] = useState([]);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaTransform, setCaptchaTransform] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    address: "",
    qualification: "",
    enrollment: "",
    course: "",
    branchId: "",
    sessionId: "",
    role: "examinee",
    image: null,
  });

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaTransform(`rotate(${Math.random() * 10 - 5}deg)`);
    setCaptchaInput("");
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fetch Branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/branches");
        setBranch(res.data);
      } catch (err) {
        toast.error("Failed to load branches.");
        console.error("Branch fetch error:", err);
      }
    };
    fetchBranches();
  }, []);

  // Fetch Session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sessions/active/only");
        const sessionId = res.data?._id;
        if (sessionId) {
          setFormData((prev) => ({ ...prev, sessionId }));
        } else {
          toast.error("No active session found. Contact admin.");
        }
      } catch (err) {
        toast.error("Error fetching session.");
        console.error("Session fetch error:", err);
      }
    };
    fetchSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (captchaInput.toUpperCase() !== captcha) {
      toast.error("Captcha is incorrect!");
      refreshCaptcha();
      return;
    }

    const formPayload = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        formPayload.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/examinees", formPayload);
      if (res.data.message) {
        toast.success("Registration Successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error("You are already registered or something went wrong.");
    }
  };

  return (
    <>
      <Header />
      <div className="signup-page py-5 text-white" style={{ backgroundColor: "#1a1a1a" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={10}>
              <h2 className="text-center mb-4">Create an Account</h2>
              <Form onSubmit={handleSubmit}>
                {/* All Input Fields (as before) */}
                {/* Example: */}
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Father's Name</Form.Label>
                      <Form.Control type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>

               <div className="row">
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Mother's Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>College</Form.Label>
                      <Form.Control
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Qualification</Form.Label>
                      <Form.Control
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Enrollment Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="enrollment"
                        value={formData.enrollment}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Upload Profile Image</Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Course</Form.Label>
                      <Form.Control
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Branch</Form.Label>
                      <Form.Select
                        name="branchId"
                        value={formData.branchId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Branch</option>
                        {branch?.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group className="mb-4">
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="examinee">Examinee</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>


                {/* Captcha Section */}
                <Form.Group className="mb-3">
                  <Form.Label>Captcha</Form.Label>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "24px",
                      letterSpacing: "4px",
                      backgroundColor: "#333",
                      color: "#0f0",
                      userSelect: "none",
                      padding: "8px",
                      display: "inline-block",
                      borderRadius: "5px",
                      cursor: "pointer",
                      transform: captchaTransform,
                      marginBottom: "8px",
                    }}
                    onClick={refreshCaptcha}
                    title="Click to refresh captcha"
                  >
                    {captcha}
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="Enter captcha here"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Sign Up
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;
