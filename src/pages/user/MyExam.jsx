import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router';
import axios from 'axios';

const MyExam = () => {
  const [exams, setExams] = useState([]);
  const [attemptedExams, setAttemptedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Get the current user from localStorage
  const user = JSON.parse(localStorage.getItem("ibtUser"));

  useEffect(() => {
    if (!user?._id) return; // Check if the user is present

    // Fetch scheduled exams only once, when the user is set
    fetchScheduledExams();
    // Fetch attempted exams only once, when the user is set
    fetchAttemptedExams();
  }, [user?._id]); // Only run when user._id changes

  // Fetch scheduled exams from the backend
  const fetchScheduledExams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/examinations?status=Scheduled');
      setExams(res.data);
    } catch (err) {
      console.error("Error fetching scheduled exams:", err);
    }
  };

  // Fetch attempted exams from the backend
  const fetchAttemptedExams = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/exams/attempted/${user._id}`);
      setAttemptedExams(res.data);
    } catch (err) {
      console.error("Error fetching attempted exams:", err);
    }
  };

  // Handle change of answer for each question
  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  // Submit the exam
  const handleSubmitExam = async () => {
    try {
      await axios.post('http://localhost:5000/api/exams/submit', {
        studentId: user._id,
        examId: selectedExam._id,
        answers
      });
      alert("Exam submitted successfully!");
      setShowModal(false);
      fetchAttemptedExams(); // Refresh attempted exams after submission
    } catch (err) {
      console.error("Error submitting exam:", err);
      alert("Submission failed.");
    }
  };

  // Check if the exam is available based on the date
  const isExamAvailable = (examDate) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date as "YYYY-MM-DD"
    const examDateString = examDate; // Exam date is already in "YYYY-MM-DD" format in your database
    // console.log(currentDate+" "+examDate);
    
    return examDateString <= currentDate;
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-success">📝 Available Exams</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Total Marks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.length > 0 ? exams.map(exam => (
            <tr key={exam._id}>
              <td>{exam.title}</td>
              <td>{exam.subject}</td>
              <td>{new Date(exam.date).toLocaleDateString()}</td>
              <td>{exam.duration} min</td>
              <td>{exam.totalMarks}</td>
              <td>
                <Link to='/student/attempt'>
                <Button 
                  onClick={() => { setSelectedExam(exam); setShowModal(true); }} 
                  disabled={!isExamAvailable(exam.date)} 
                >
                  {isExamAvailable(exam.date) ? 'Take Exam' : 'Exam Not Available Yet'}
                </Button>
                </Link>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6" className="text-center">No Scheduled Exams</td></tr>
          )}
        </tbody>
      </Table>

      <h3 className="mt-5 mb-3 text-primary">📊 Attempted Exams</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Exam</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attemptedExams.length > 0 ? attemptedExams.map((exam, idx) => (
            <tr key={idx}>
              <td>{exam.subject}</td>
              <td>{exam.score}/{exam.totalMarks}</td>
              <td>{exam.score >= exam.passingMarks ? "Pass" : "Fail"}</td>
            </tr>
          )) : (
            <tr><td colSpan="3" className="text-center">No exams attempted</td></tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedExam?.subject} - Exam</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExam?.questions?.length ? selectedExam.questions.map((q, i) => (
            <Card className="mb-3" key={q._id}>
              <Card.Body>
                <p><strong>Q{i + 1}: {q.question}</strong></p>
                {q.options.map((opt, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    name={`q-${q._id}`}
                    label={opt}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={() => handleOptionChange(q._id, opt)}
                  />
                ))}
              </Card.Body>
            </Card>
          )) : <p>No questions available.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmitExam}>Submit Exam</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyExam;
