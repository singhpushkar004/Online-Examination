import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const QuestionBankModule = () => {
  const [questions, setQuestions] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const [formData, setFormData] = useState({
    subject: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    marks: '',
   
  });

  const API_URL = 'http://localhost:5000/api/questions';

  useEffect(() => {
    fetchQuestions();
    fetchExams();
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error('Error fetching subjects', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(API_URL);
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions', err);
    }
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${API_URL}/exams`);
      
    } catch (err) {
      console.error('Error fetching exams', err);
    }
  };

  const handleShowModal = (question = null) => {
    if (question) {
      setFormData({
        ...question,
      });
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
        marks: '',
        
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

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!file) return setUploadMessage('Please select a CSV file first.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload-questions', formData);
      setUploadMessage(`${res.data.count} Questions uploaded successfully.`);
      fetchQuestions();
    } catch (err) {
      setUploadMessage('Upload failed. ' + (err.response?.data?.error || ''));
      console.log(err);
    }
  };

  // DataTable columns definition
  const columns = [
    {
      name: 'S.N',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '60px',
    },
    
    {
      name: 'Subject',
      selector: row => row.subject?.name,
      sortable: true,
    },
    {
      name: 'Question',
      selector: row => row.question,
      sortable: true,
      wrap: true,
    },
    { name: 'A', selector: row => row.optionA, sortable: false },
    { name: 'B', selector: row => row.optionB, sortable: false },
    { name: 'C', selector: row => row.optionC, sortable: false },
    { name: 'D', selector: row => row.optionD, sortable: false },
    { name: 'Correct', selector: row => row.correctAnswer, sortable: true },
    { name: 'Marks', selector: row => row.marks, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className='d-flex'>
          <Button variant="success" size="sm" onClick={() => handleShowModal(row)}>✏️</Button>{' '}
          <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>🗑️</Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

  const tableData = {
    columns,
    data: questions,
    exportHeaders: true,
    export: true,
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-success">Admin - Question Bank Module</h3>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="success" onClick={() => handleShowModal()} className='  btn-sm h-75'>Add Question</Button>
        <a href="http://localhost:5000/uploads/questions_sample.csv" className='btn btn-secondary btn-sm h-75'>Download CSV Format</a>
        <Form inline="true" onSubmit={handleCSVUpload} encType='multipart/form-data' className="d-flex">
          <Form.Control type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className='h-75'/>
          <Button variant="primary" type="submit" className="ms-2 btn-sm h-75 py-1">Upload</Button>
        </Form>
      </div>

      {uploadMessage && <Alert variant="info" className="mb-3">{uploadMessage}</Alert>}

      <DataTableExtensions {...tableData}>
        <DataTable
          noHeader
          defaultSortField="question"
          defaultSortAsc={true}
          pagination
          highlightOnHover
          dense
          fixedHeader
          fixedHeaderScrollHeight="500px"
        />
      </DataTableExtensions>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          

            <Form.Group className="mb-2">
              <Form.Label>Subject</Form.Label>
              <Form.Select name="subject" value={formData.subject} onChange={handleInputChange}>
                <option value="">-- Select Subject --</option>
                {subjects.map((subj) => (
                  <option key={subj._id} value={subj._id}>{subj.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {[
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
                <Form.Control type={field.type || 'text'} name={field.name} value={formData[field.name]} onChange={handleInputChange} />
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
