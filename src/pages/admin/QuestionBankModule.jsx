import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const QuestionBankModule = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    marks: ''
  });

  const API_URL = 'http://localhost:5000/api/questions';

  // Fetch all questions on load
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(API_URL);
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions', err);
    }
  };

  const handleShowModal = (question = null) => {
    if (question) {
      setFormData(question);
      setEditingId(question._id);
    } else {
      setFormData({
        subject: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        marks: ''
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchQuestions();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving question', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error('Error deleting question', err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-success">Admin - Question Bank Module</h3>
      <Button variant="success" onClick={() => handleShowModal()}>Add Question</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Question</th>
            <th>A</th>
            <th>B</th>
            <th>C</th>
            <th>D</th>
            <th>Correct</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.length > 0 ? questions.map((q) => (
            <tr key={q._id}>
              <td>{q.subject}</td>
              <td>{q.question}</td>
              <td>{q.optionA}</td>
              <td>{q.optionB}</td>
              <td>{q.optionC}</td>
              <td>{q.optionD}</td>
              <td>{q.correctAnswer}</td>
              <td>{q.marks}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleShowModal(q)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(q._id)}>Delete</Button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="9" className="text-center">No questions found</td></tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[
              { label: 'Subject', name: 'subject' },
              { label: 'Question Text', name: 'question' },
              { label: 'Option A', name: 'optionA' },
              { label: 'Option B', name: 'optionB' },
              { label: 'Option C', name: 'optionC' },
              { label: 'Option D', name: 'optionD' },
              { label: 'Correct Answer', name: 'correctAnswer' },
              { label: 'Marks', name: 'marks', type: 'number' }
            ].map((field, idx) => (
              <Form.Group className="mb-2" key={idx}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="success" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuestionBankModule;
