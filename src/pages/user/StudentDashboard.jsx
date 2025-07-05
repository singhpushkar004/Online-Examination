import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, Button, ProgressBar, Container } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const StudentDashboard = () => {
  const [student, setStudent] = useState({});
  const [marks, setMarks] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem('ibtUser'));
    const token = localStorage.getItem('ibtToken');

    if (!storedStudent || !storedStudent._id) {
      alert("No student logged in!");
      window.location.href = "/login";
      return;
    }

    const studentId = storedStudent._id;
    setStudent(storedStudent);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    // console.log(studentId);
    
    // Fetch marks (exam attempts with scores)
    axios.get(`http://localhost:5000/api/exams/attempted/${studentId}`, config)
      .then(res => setMarks(res.data))
      .catch(err => console.error('Error fetching marks:', err));

    // Fetch assigned exams (optional)
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

  // Prepare data for the Bar chart
  const chartData = {
    labels: marks.map(m => m.examId?.title || 'Untitled'),
    datasets: [
      {
        label: 'Score %',
        data: marks.map(m => {
          if (!m.score || !m.totalMarks) return 0;
          return ((m.score / m.totalMarks) * 100).toFixed(2);
        }),
        backgroundColor: 'rgba(13, 110, 253, 0.7)', // bootstrap primary color with transparency
        borderRadius: 4,
        maxBarThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${context.parsed.y}%`,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`
        }
      }
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="text-success mb-4">Welcome, {student.name || 'Student'}</h3>

      <div className="row">
        <div className="col-sm-11 mx-auto">
          {/* Progress Chart */}
      {marks.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="mb-4">Your Exam Progress</h5>
            <Bar data={chartData} options={chartOptions} />
          </Card.Body>
        </Card>
      )}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-11 mx-auto">
          {/* Progress Bars Summary */}
      {marks.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="mb-4">Progress Summary</h5>
            {marks.map((m, idx) => {
              const percent = m.score && m.totalMarks ? ((m.score / m.totalMarks) * 100).toFixed(2) : 0;
              const passed = m.score >= m.passingMarks;
              return (
                <div key={idx} className="mb-3">
                  <strong>{m.examId?.title || 'Untitled Exam'}</strong>
                  <ProgressBar
                    now={percent}
                    label={`${percent}%`}
                    variant={passed ? 'success' : 'danger'}
                    style={{ height: '25px', fontWeight: 'bold' }}
                    className="mt-2"
                  />
                </div>
              );
            })}
          </Card.Body>
        </Card>
      )}

        </div>
      </div>
      <div className="row">
        <div className="col-sm-11 mx-auto">
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5>Profile Information</h5>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Registration No:</strong> {student._id || 'N/A'}</p>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-11 mx-auto">
          
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5>Exam Results</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr className='table-dark'>
                <th>S.N</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {marks.length > 0 ? marks.map((res, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{res.examId?.title}</td>
                  <td>{res.examId?.subjectId?.name}</td>
                  <td>{new Date(res.date).toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center">No results found</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
        </div>
      </div>

      <Button variant="danger" onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default StudentDashboard;
