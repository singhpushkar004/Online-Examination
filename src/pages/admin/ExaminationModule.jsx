import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const API_URL = 'http://localhost:5000/api/examinations';
const SESSION_API = 'http://localhost:5000/api/sessions';
const BRANCH_API = 'http://localhost:5000/api/branches';

const ExaminationModule = () => {
  const [examinations, setExaminations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [questionDistribution, setQuestionDistribution] = useState([
  { subject: '', questionLimit: '' }
]);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    branchId: '',
    date: '',
    time: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    sessionId: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    fetchExaminations();
    fetchSessions();
    fetchBranches();
    fetchSubjects();
  }, []);

  const fetchExaminations = async () => {
    const res = await axios.get(API_URL);
    setExaminations(res.data);
  };

  const fetchSessions = async () => {
    const res = await axios.get(`${SESSION_API}/active/only`);
    setSessions(res.data);
    // console.log(res.data);
    
  };

  const fetchSubjects = async () => {
    const res = await axios.get('http://localhost:5000/api/subjects');
    setSubjects(res.data);
  };

  const fetchBranches = async () => {
    const res = await axios.get(BRANCH_API);
    setBranches(res.data);
  };

  const handleShowModal = (exam = null) => {
    if (exam) {
      setFormData({
        ...exam,
        subjectId: exam.subjectId?._id || '',
        branchId: exam.branchId?._id || '',
        sessionId: exam.sessionId?._id || '',
      });
      setEditingId(exam._id);
      setQuestionDistribution(exam.questionDistribution || []);
    } else {
      setFormData({
        title: '',
        subjectId: '',
        branchId: '',
        date: '',
        time: '',
        duration: '',
        totalMarks: '',
        passingMarks: '',
        sessionId: '',
        status: 'Scheduled',
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
     if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, { ...formData, questionDistribution });
    } else {
      await axios.post(API_URL, { ...formData, questionDistribution });
    }

      fetchExaminations();
      setShowModal(false);
    } catch (err) {
      console.error('Error saving examination:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this examination?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchExaminations();
    }
  };

  // Filtered examinations based on search text
  const filteredExaminations = examinations.filter(
    (exam) =>
      exam.title?.toLowerCase().includes(filterText.toLowerCase()) ||
      exam.subjectId?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      exam.branchId?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      exam.status?.toLowerCase().includes(filterText.toLowerCase())
  );

  // Define columns for DataTable
  const columns = [
    {
      name: 'S.N',
      selector: (_, index) => index + 1,
      width: '60px',
      sortable: false,
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Subject',
      selector: (row) => row.subjectId?.name || '-',
      sortable: true,
    },
    {
      name: 'Branch',
      selector: (row) => row.branchId?.name || '-',
      sortable: true,
    },
    {
      name: 'Examination Id',
      selector: (row) => row._id,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Date',
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: 'Time',
      selector: (row) => row.time,
      sortable: true,
    },
    {
      name: 'Duration',
      selector: (row) => row.duration,
      sortable: true,
    },
    {
      name: 'Total Marks',
      selector: (row) => row.totalMarks,
      sortable: true,
    },
    {
      name: 'Passing',
      selector: (row) => row.passingMarks,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button size="sm" variant="success" onClick={() => handleShowModal(row)}>
            <i className="fa fa-edit"></i>
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row._id)}>
            <i className="fa fa-trash"></i>
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];
 


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Button onClick={() => handleShowModal()} variant="info">
          Add Examination
        </Button>
        <input
          type="text"
          placeholder="Search examinations..."
          className="form-control w-25"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredExaminations}
        pagination
        highlightOnHover
        striped
        persistTableHead
        noHeader
        dense
        defaultSortFieldId={2} // sort by Title by default (optional)
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Examination</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {['title', 'date', 'time', 'duration', 'totalMarks', 'passingMarks'].map((field) => (
              <Form.Group className="mb-2" key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === 'date' ? 'date' : field === 'time' ? 'time' : 'text'}
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-2">
              <Form.Label>Subject</Form.Label>
              <Form.Select name="subjectId" value={formData.subjectId || ''} onChange={handleInputChange}>
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Branch</Form.Label>
              <Form.Select name="branchId" value={formData.branchId || ''} onChange={handleInputChange}>
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Session</Form.Label>
              <Form.Select name="sessionId" value={formData.sessionId || ''} onChange={handleInputChange}>
                <option value="">Select Session</option>
                
                  <option key={sessions._id} value={sessions._id}>
                   {sessions.sessionName}
                  </option>
                
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Question Distribution</Form.Label>
              {questionDistribution.map((q, index) => (
                <div key={index} className="d-flex mb-2 gap-2">
                  <Form.Select
                    value={q.subject}
                    onChange={(e) => {
                      const newDist = [...questionDistribution];
                      newDist[index].subject = e.target.value;
                      setQuestionDistribution(newDist);
                    }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>{subject.name}</option>
                    ))}
                  </Form.Select>

                  <Form.Control
                      type="number"
                      placeholder="Number of Questions"
                      value={q.questionCount}
                      onChange={(e) => {
                        const newDist = [...questionDistribution];
                        newDist[index].questionCount = parseInt(e.target.value);
                        setQuestionDistribution(newDist);
                      }}
                    />


                  <Button variant="danger" onClick={() => {
                    const newDist = questionDistribution.filter((_, i) => i !== index);
                    setQuestionDistribution(newDist);
                  }}>×</Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() =>
                setQuestionDistribution([...questionDistribution, { subject: '', questionLimit: '' }])
              }>+ Add Subject</Button>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" name="status" readOnly value={formData.status || ''} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="info" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExaminationModule;
