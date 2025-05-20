import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, Button } from 'react-bootstrap';

const StudentDashboard = () => {
  const [student, setStudent] = useState({});
  const [marks, setMarks] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Get student info from localStorage
    const storedStudent = JSON.parse(localStorage.getItem('ibtUser'));
    const token = localStorage.getItem('ibtToken');

    if (!storedStudent || !storedStudent._id) {
      alert("No student logged in!");
      window.location.href = "/login";
      return;
    }

    const studentId = storedStudent._id;
    setStudent(storedStudent);

    // Config for authorized requests (optional if required by backend)
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // Fetch marks
    axios.get(`http://localhost:5000/api/results/student/${studentId}`, config)
      .then(res => setMarks(res.data))
      .catch(err => console.error('Error fetching marks:', err));

    // Fetch assigned exams
    axios.get(`http://localhost:5000/api/examinations`, config)
      .then(res => setExams(res.data))
      .catch(err => console.error('Error fetching exams:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ibtUser');
    localStorage.removeItem('ibtToken');
    alert("Logged out!");
    window.location.href = "/login";
  };

  return (
    <div className="container mt-4">
      <h3 className="text-success">Welcome, {student.name || 'Student'}</h3>

      <Card className="mb-4">
        <Card.Body>
          <h5>Profile Information</h5>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Registration No:</strong> {student._id || 'N/A'}</p>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5>Exam Results</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {marks.length > 0 ? marks.map((mark, idx) => (
                <tr key={idx}>
                  <td>{mark.subject}</td>
                  <td>{mark.score}</td>
                  <td>{mark.score >= 40 ? 'Pass' : 'Fail'}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="text-center">No results yet</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5>Upcoming Exams</h5>
          <ul>
            {exams.length > 0 ? exams.map((exam, idx) => (
              <li key={idx}>{exam.subject} - {new Date(exam.date).toLocaleDateString()}</li>
            )) : <p>No exams assigned</p>}
          </ul>
        </Card.Body>
      </Card>

      <Button variant="danger" onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default StudentDashboard;
