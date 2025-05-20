import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AttemptExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { exam } = location.state || {};

  const user = JSON.parse(localStorage.getItem("ibtUser"));
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!exam || !exam._id) {
      alert("Exam data not found. Redirecting...");
      navigate("/student/"); // or your appropriate route
      return;
    }

    fetchQuestions();
  }, [exam]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/questions");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API Response:", data);

      // If response is { questions: [...] }, extract it
      const questionArray = Array.isArray(data) ? data : data.questions || [];

      console.log("Exam subject:", exam?.subject);

      // Filter questions for current exam subject
      const filtered = questionArray.filter(q =>
        q.subject?.toLowerCase() === exam.subject?.toLowerCase()
      );

      const formattedQuestions = filtered.map(q => ({
        ...q,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
      }));

      setQuestions(formattedQuestions);
      console.log("Filtered & formatted questions:", formattedQuestions);
    } catch (error) {
      console.error("Fetch error:", error.message);
      alert("Failed to fetch questions.");
    }
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitExam = async () => {
    try {
      await axios.post('http://localhost:5000/api/exams/submit', {
        studentId: user._id,
        examId: exam._id,
        answers
      });
      alert("Exam submitted successfully!");
      navigate("/student-dashboard"); // or show results
    } catch (err) {
      console.error("Error submitting exam:", err);
      alert("Submission failed.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-success">Exam: {exam?.subject}</h3>

      {questions.length ? questions.map((q, i) => (
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
      )) : <p>Loading questions...</p>}

      {questions.length > 0 && (
        <Button variant="primary" onClick={handleSubmitExam}>
          Submit Exam
        </Button>
      )}
    </div>
  );
};

export default AttemptExam;
