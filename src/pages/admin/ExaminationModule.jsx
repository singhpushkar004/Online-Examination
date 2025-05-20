import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/examinations'; // adjust if needed

const ExaminationModule = () => {
  const [examinations, setExaminations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    fetchExaminations();
  }, []);

  const fetchExaminations = async () => {
    try {
      const res = await axios.get(API_URL);
      setExaminations(res.data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  const handleShowModal = (exam = null) => {
    if (exam) {
      setFormData(exam);
      setEditingId(exam._id);
    } else {
      setFormData({
        title: '',
        subject: '',
        date: '',
        duration: '',
        totalMarks: '',
        passingMarks: '',
        status: 'Scheduled'
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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
      fetchExaminations();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving exam:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExaminations();
    } catch (err) {
      console.error('Error deleting exam:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-info">Admin - Examination Module</h3>
      <Button variant="info" onClick={() => handleShowModal()}>Add Examination</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Duration (min)</th>
            <th>Total Marks</th>
            <th>Passing</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {examinations.length > 0 ? examinations.map((exam) => (
            <tr key={exam._id}>
              <td>{exam.title}</td>
              <td>{exam.subject}</td>
              <td>{exam.date}</td>
              <td>{exam.duration}</td>
              <td>{exam.totalMarks}</td>
              <td>{exam.passingMarks}</td>
              <td>{exam.status}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleShowModal(exam)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(exam._id)}>Delete</Button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="8" className="text-center">No examinations found</td></tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Examination</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[
              { label: 'Title', name: 'title' },
              { label: 'Subject', name: 'subject' },
              { label: 'Date', name: 'date', type: 'date' },
              { label: 'Duration (in minutes)', name: 'duration' },
              { label: 'Total Marks', name: 'totalMarks' },
              { label: 'Passing Marks', name: 'passingMarks' },
              { label: 'Status', name: 'status' }
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
          <Button variant="info" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExaminationModule;
