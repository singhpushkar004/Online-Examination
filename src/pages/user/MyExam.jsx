import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import axios from 'axios';

const MyExam = () => {
  const [exams, setExams] = useState([]);
  const [attemptedExams, setAttemptedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const user = JSON.parse(localStorage.getItem("ibtUser"));
  const branchId = JSON.parse(localStorage.getItem("branchId"));

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const [scheduledExamsRes, attemptedExamsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/examinations?status=Scheduled&branchId=${branchId}`),
          axios.get(`http://localhost:5000/api/exams/available/${user._id}`)
        ]);

        setExams(scheduledExamsRes.data);
        setAttemptedExams(attemptedExamsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [user?._id]);

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleFullScreen = async () => {
    const el = document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
    else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) await el.msRequestFullscreen();
  };

  const exitFullScreen = async () => {
    if (document.exitFullscreen) await document.exitFullscreen();
    else if (document.mozCancelFullScreen) await document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
    else if (document.msExitFullscreen) await document.msExitFullscreen();
  };

  const submitExam = async () => {
    if (!selectedExam || autoSubmitted) return;
    setAutoSubmitted(true);

    try {
      await axios.post('http://localhost:5000/api/exams/submit', {
        studentId: user._id,
        examId: selectedExam._id,
        sessionId: selectedExam.sessionId,
        answers
      });

      alert("Exam submitted successfully.");
      await exitFullScreen();
      setShowModal(false);

      const res = await axios.get(`http://localhost:5000/api/exams/attempted/${user._id}`);
      setAttemptedExams(res.data);
      setSelectedExam(null);
      setAnswers({});
    } catch (err) {
      console.error("Error submitting exam:", err);
      alert("Submission failed.");
    } finally {
      setAutoSubmitted(false);
    }
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
      await handleFullScreen();
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      alert("Questions not found for this exam.");
    }
  };

  useEffect(() => {
    if (!showModal) return;
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showModal]);

  useEffect(() => {
    if (!showModal) return;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        submitExam();
      }
    };

    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        alert("⚠️ You cannot exit fullscreen during the exam.");
        handleFullScreen(); // Re-enter fullscreen
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("fullscreenchange", onFullScreenChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, [showModal]);

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

  useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const updatedExams = exams.map((exam) => {
      const start = new Date(`${exam.date}T${exam.time}`);
      const end = new Date(start.getTime() + exam.duration * 60000);
      const isNowAvailable = now >= start && now <= end;
      return { ...exam, isNowAvailable };
    });

    setExams(updatedExams);
  }, 30000); // check every 30 seconds

  return () => clearInterval(interval);
}, [exams]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-success">📝 Available Exams</h3>
      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, i) => {
            const alreadyAttempted = attemptedExams.some(a => a.examId._id === exam._id);
            return (
              <tr key={exam._id}>
                <td>{i + 1}</td>
                <td>{exam.title}</td>
                <td>{exam.subjectId?.name}</td>
                <td>{new Date(exam.date).toLocaleDateString()}</td>
                <td>{exam.time}</td>
                <td>{exam.duration} min</td>
                <td>
                  <Button
                    disabled={!isExamAvailable(exam.date, exam.time, exam.duration) || alreadyAttempted}
                    onClick={() => {
                      if (alreadyAttempted) return alert("Already attempted.");
                      handleTakeExam(exam);
                    }}
                  >
                    {alreadyAttempted ? "Attempted" : "Take Exam"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => {}} size="lg" backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>
            {selectedExam?.title} - Time Left: {formatTime(remainingTime)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExam?.questions?.map((q, i) => (
            <Card key={q._id} className="mb-3">
              <Card.Body>
                <p><strong>Q{i + 1}: {q.question}</strong></p>
                {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, idx) => (
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
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={submitExam}>Submit Exam</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyExam;
