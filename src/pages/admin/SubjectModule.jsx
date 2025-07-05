import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const SubjectModule = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    branchId: ''
  });
  const [searchText, setSearchText] = useState('');

  const API_URL = 'http://localhost:5000/api/subjects';
  const BRANCH_API = 'http://localhost:5000/api/branches';

  useEffect(() => {
    fetchSubjects();
    fetchBranches();
  }, []);

  const fetchSubjects = async () => {
    const res = await axios.get(API_URL);
    setSubjects(res.data);
    setFilteredSubjects(res.data);
  };

  const fetchBranches = async () => {
    const res = await axios.get(BRANCH_API);
    setBranches(res.data);
  };

  // Search filter logic
  useEffect(() => {
    if (!searchText) {
      setFilteredSubjects(subjects);
    } else {
      const lowercased = searchText.toLowerCase();
      const filtered = subjects.filter(sub =>
        sub.name.toLowerCase().includes(lowercased) ||
        (sub.description && sub.description.toLowerCase().includes(lowercased)) ||
        (sub.branchId?.name && sub.branchId.name.toLowerCase().includes(lowercased))
      );
      setFilteredSubjects(filtered);
    }
  }, [searchText, subjects]);

  const handleShowModal = (subject = null) => {
    if (subject) {
      setFormData({
        name: subject.name,
        description: subject.description,
        branchId: subject.branchId?._id || ''
      });
      setEditingId(subject._id);
    } else {
      setFormData({ name: '', description: '', branchId: '' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchSubjects();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving subject:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  const columns = [
    {
      name: 'S.N',
      selector: (row, index) => index + 1,
      width: '60px',
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Branch',
      selector: row => row.branchId?.name || '',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex justify-content-evenly w-100">
          <Button variant="success" size="sm" onClick={() => handleShowModal(row)}>
            <i className="fa fa-edit"></i>
          </Button>{' '}
          <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
            <i className="fa fa-trash"></i>
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    }
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button onClick={() => handleShowModal()}>Add Subject</Button>
        <Form.Control
          type="text"
          placeholder="Search subjects..."
          style={{ width: '300px' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredSubjects}
        pagination
        highlightOnHover
        defaultSortField="name"
        responsive
        noDataComponent="No subjects found"
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit' : 'Add'} Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Branch</Form.Label>
              <Form.Select
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
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

export default SubjectModule;
