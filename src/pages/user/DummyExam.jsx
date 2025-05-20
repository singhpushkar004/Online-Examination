import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const DummyExam = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Fetch all questions on load
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(q => {
      const selected = answers[q._id];
      if (selected === q.correctAnswer) {
        calculatedScore += q.marks || 1; // default 1 mark if not specified
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
  };

  const resetExam = () => {
    setAnswers({});
    setScore(null);
    setSubmitted(false);
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🎯 Take Dummy Exam</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Start Exam
      </Button>

      <Modal show={showModal} onHide={resetExam} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Dummy Exam (Practice)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {questions.length === 0 ? (
            <p>Loading questions...</p>
          ) : (
            questions.map((q, index) => (
              <Card className="mb-3" key={q._id}>
                <Card.Body>
                  <p><strong>Q{index + 1}: {q.question}</strong></p>
                  {q.options.map((opt, i) => (
                    <Form.Check
                      key={i}
                      type="radio"
                      label={opt}
                      name={`q-${q._id}`}
                      checked={answers[q._id] === opt}
                      onChange={() => handleOptionChange(q._id, opt)}
                    />
                  ))}
                </Card.Body>
              </Card>
            ))
          )}

          {submitted && (
            <Alert variant="info">
              <strong>Your Score:</strong> {score} / {questions.reduce((acc, q) => acc + (q.marks || 1), 0)}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!submitted ? (
            <Button variant="success" onClick={handleSubmit}>Submit Exam</Button>
          ) : (
            <Button variant="secondary" onClick={resetExam}>Close</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DummyExam;
