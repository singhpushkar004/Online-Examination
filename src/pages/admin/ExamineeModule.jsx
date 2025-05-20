import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';

const API_URL = 'http://localhost:5000/api/examinees'; // Change this if your port is different

const ExamineeModule = () => {
  const [examinees, setExaminees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    contact: '',
    email:'',
    college: '',
    address: '',
    qualification: '',
    enrollment:'',
    course:'',
    
  });

  useEffect(() => {
    fetchExaminees();
  }, []);

  const fetchExaminees = async () => {
    try {
      const res = await axios.get(API_URL);
      setExaminees(res.data.data);
      console.log(res.data);
      
    } catch (error) {
      console.error("Error fetching examinees", error);
    }
  };

  const handleShowModal = (examinee = null) => {
    if (examinee) {
      setFormData(examinee);
      setEditingId(examinee._id);
    } else {
      setFormData({
        name: '',
        fatherName: '',
        motherName: '',
        dob: '',
        contact: '',
        email:'',
        college: '',
        address: '',
        qualification: '',
        enrollment:'',
        course:'',
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
      handleCloseModal();
      fetchExaminees();
    } catch (error) {
      console.error("Error saving examinee", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExaminees();
    } catch (error) {
      console.error("Error deleting examinee", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">Examinee Module</h3>
      <Button variant="primary" onClick={() => handleShowModal()}>Add Examinee</Button>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Father</th>
            <th>Mother</th>
            <th>DOB</th>
            <th>Contact</th>
            <th>College</th>
            <th>Address</th>
            <th>Qualification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {examinees.length > 0 ? examinees.map((ex) => (
            <tr key={ex._id}>
              <td>{ex.name}</td>
              <td>{ex.fatherName}</td>
              <td>{ex.motherName}</td>
              <td>{ex.dob}</td>
              <td>{ex.contact}</td>
              <td>{ex.college}</td>
              <td>{ex.address}</td>
              <td>{ex.qualification}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleShowModal(ex)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(ex._id)}>Delete</Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="9" className="text-center">No examinees found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Examinee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[
              { label: 'Name', name: 'name' },
              { label: "Father's Name", name: 'fatherName' },
              { label: "Mother's Name", name: 'motherName' },
              { label: 'DOB', name: 'dob', type: 'date' },
              { label: 'Contact', name: 'contact' },
              { label: 'College', name: 'college' },
              { label: 'Address', name: 'address' },
              { label: 'Qualification', name: 'qualification' },
              { label: 'Email', name: 'email' },
              { label: 'Enrollment', name: 'enrollment' },
              { label: 'Course', name: 'course' }
            ].map((field, i) => (
              <Form.Group className="mb-2" key={i}>
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
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExamineeModule;
