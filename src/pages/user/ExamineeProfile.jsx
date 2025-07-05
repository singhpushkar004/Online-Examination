import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';

const ExamineeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem('ibtUser'));
  const examineeId = storedUser?._id;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/examinees/${examineeId}`);
      const data = await res.json();
      setProfile(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading profile...</p>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="text-center mt-5">
        <p>Profile not found.</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center" >
        <Col md={10}>
          <Card className="shadow-lg  p-4 rounded-4" style={{borderTop:"5px solid blue" , borderBottom:"5px solid blue"}}>
            <Row>
              {/* Profile Image & Basic Info */}
              <Col md={4} className="text-center border-end d-flex flex-column align-items-center justify-content-center p-4">
                <img
                  src={
                    profile.image
                      ? `http://localhost:5000/uploads/${profile.image}`
                      : 'https://avatar.iran.liara.run/public/10'
                  }
                  alt="Profile"
                  className="rounded-circle shadow mb-3"
                  style={{ width: '140px', height: '140px', objectFit: 'cover', border: '3px solid #0d6efd' }}
                />
                <h4 className="fw-bold text-capitalize">{profile.name}</h4>
                <p className="text-muted mb-1">{profile.email}</p>
                <Badge bg={profile.status === '1' ? 'success' : 'danger'}>
                  {profile.status === '1' ? 'Active' : 'Inactive'}
                </Badge>
              </Col>

              {/* Profile Details */}
              <Col md={8} className="p-4">
                <h5 className="mb-4 fw-semibold text-primary">Profile Details</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <strong>Father's Name:</strong> <div>{profile.fatherName}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <strong>Mother's Name:</strong> <div>{profile.motherName}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <strong>DOB:</strong> <div>{profile.dob}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <strong>Contact:</strong> <div>{profile.contact}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <strong>College:</strong> <div>{profile.college}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <strong>Address:</strong> <div>{profile.address}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <strong>Qualification:</strong> <div>{profile.qualification}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <strong>Enrollment No:</strong> <div>{profile.enrollment}</div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <strong>Course:</strong> <div>{profile.course}</div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExamineeProfile;
