import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import axios from 'axios';

const MyExam = () => {
  const [exams, setExams] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [attemptedExams, setAttemptedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [examTimer, setExamTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const user = JSON.parse(localStorage.getItem("ibtUser"));
  const branchId = JSON.parse(localStorage.getItem("branchId"));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'F5' ||
        (e.ctrlKey && e.key.toLowerCase() === 'r') ||
        (e.metaKey && e.key.toLowerCase() === 'r')
      ) {
        e.preventDefault();
        alert("Page refresh is disabled during the exam.");
      }

      if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'v'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert("Copy, cut and paste actions are disabled during the exam.");
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      alert("Right-click is disabled during the exam.");
    };

    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [showModal]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const [scheduledExamsRes, attemptedExamsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/examinations?status=Scheduled&branchId=${branchId}`),
          axios.get(`http://localhost:5000/api/exams/attempted/${user._id}`)
        ]);

        setExams(scheduledExamsRes.data);
        setAttemptedExams(attemptedExamsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to fetch exam data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await axios.get('http://localhost:5000/api/sessions/active/only');
      setSessionId(res.data._id);
    };
    fetchSession();
  }, []);

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const submitExam = async () => {
    if (!selectedExam || autoSubmitted) return;
    setAutoSubmitted(true);

    try {
      const answerArray = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));

      await axios.post('http://localhost:5000/api/exams/submit', {
        studentId: user._id,
        examId: selectedExam._id,
        answers: answerArray,
        sessionId:sessionId._id,
      });

      alert("Exam submitted.");
      setShowModal(false);
      const res = await axios.get(`http://localhost:5000/api/exams/attempted/${user._id}`);
      setAttemptedExams(res.data);

      setSelectedExam(null);
      setAnswers({});
      setAutoSubmitted(false);
      if (examTimer) clearTimeout(examTimer);
    } catch (err) {
      console.error("Error submitting exam:", err);
      alert("Submission failed.");
      setAutoSubmitted(false);
    }
  };

  useEffect(() => {
    if (!showModal) return;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') submitExam();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [showModal, answers, selectedExam]);

  useEffect(() => {
    if (showModal && selectedExam?.duration) {
      const durationMs = selectedExam.duration * 60 * 1000;
      const timeoutId = setTimeout(() => {
        alert("⏰ Time is up! Exam will be submitted automatically.");
        submitExam();
      }, durationMs);
      setExamTimer(timeoutId);
      setRemainingTime(selectedExam.duration * 60);
      return () => clearTimeout(timeoutId);
    }
  }, [showModal, selectedExam]);

  useEffect(() => {
    if (!showModal || remainingTime <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [showModal, remainingTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isExamAvailable = (examDate, examTime, duration) => {
    const now = new Date();
    const start = new Date(`${examDate}T${examTime}`);
    const end = new Date(start.getTime() + duration * 60000);
    return now >= start && now <= end;
  };

  const handleTakeExam = async (exam) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/questions/exam/${exam._id}`);
      const questions = res.data;
      setSelectedExam({ ...exam, questions });
      setAnswers({});
      setShowModal(true);
      setAutoSubmitted(false);
      setRemainingTime(exam.duration * 60);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      alert("Questions not found for this exam.");
    }
  };

  const handleSubmitExam = async () => {
    await submitExam();
  };

  if (loading) return <p>Loading exams...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-success">📝 Available Exams</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Total Marks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.length > 0 ? exams.map(exam => {
            const alreadyAttempted = attemptedExams.some(a => a.examId._id === exam._id);
            return (
              <tr key={exam._id}>
                <td>{exam.title}</td>
                <td>{exam.subjectId?.name}</td>
                <td>{new Date(exam.date).toLocaleDateString()}</td>
                <td>{exam.time}</td>
                <td>{exam.duration} min</td>
                <td>{exam.totalMarks}</td>
                <td>
                  <Button
                    onClick={() => {
                      if (alreadyAttempted) {
                        alert("You have already attempted this exam.");
                        return;
                      }
                      handleTakeExam(exam);
                    }}
                    disabled={!isExamAvailable(exam.date, exam.time, exam.duration) || alreadyAttempted}
                  >
                    {alreadyAttempted
                      ? "Already Attempted"
                      : isExamAvailable(exam.date, exam.time, exam.duration)
                        ? "Take Exam"
                        : "Not Available Yet"}
                  </Button>
                </td>
              </tr>
            );
          }) : (
            <tr><td colSpan="7" className="text-center">No Scheduled Exams</td></tr>
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
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {attemptedExams.length > 0 ? attemptedExams.map((exam, idx) => (
            <tr key={idx}>
              <td>{exam.subject}</td>
              <td>{exam.score}/{exam.totalMarks}</td>
              <td>{exam.score >= exam.passingMarks ? "Pass" : "Fail"}</td>
              <td>{new Date(exam.date).toLocaleString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="text-center">No exams attempted</td></tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        if (examTimer) clearTimeout(examTimer);
      }} size="lg" backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedExam?.subject} - Exam
            <span className="ms-4 text-danger fs-6">⏱️ Time Left: {formatTime(remainingTime)}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExam?.questions?.length > 0 ? (
            selectedExam.questions.map((q, i) => {
              const options = [q.optionA, q.optionB, q.optionC, q.optionD];
              return (
                <Card className="mb-3" key={q._id}>
                  <Card.Body>
                    <p><strong>Q{i + 1}: {q.question}</strong></p>
                    {options.map((opt, idx) => (
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
              );
            })
          ) : (
            <p>No questions available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false);
            if (examTimer) clearTimeout(examTimer);
          }}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmitExam}>Submit Exam</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyExam;