import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [branchName, setBranchName] = useState('');
  const [editingBranch, setEditingBranch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchBranches = async () => {
    const res = await axios.get('http://localhost:5000/api/branches');
    setBranches(res.data);
    setFilteredBranches(res.data);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Filter on searchText change
  useEffect(() => {
    if (!searchText) {
      setFilteredBranches(branches);
    } else {
      const lowercasedFilter = searchText.toLowerCase();
      const filteredData = branches.filter(branch =>
        branch.name.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredBranches(filteredData);
    }
  }, [searchText, branches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBranch) {
      await axios.put(`http://localhost:5000/api/branches/${editingBranch._id}`, { name: branchName });
    } else {
      await axios.post('http://localhost:5000/api/branches', { name: branchName });
    }
    setBranchName('');
    setEditingBranch(null);
    fetchBranches();
    setShowModal(false);
  };

  const handleEdit = (branch) => {
    setBranchName(branch.name);
    setEditingBranch(branch);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      await axios.delete(`http://localhost:5000/api/branches/${id}`);
      fetchBranches();
    }
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Branch Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: row => (
        <>
          <Button variant="success" size="sm" className="me-2" onClick={() => handleEdit(row)}>
            <i className="fa fa-edit"></i>
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
            <i className="fa fa-trash"></i>
          </Button>
        </>
      ),
    }
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <Button onClick={() => setShowModal(true)}>Add Branch</Button>
        <Form.Control
          type="text"
          placeholder="Search branches..."
          style={{ width: '300px' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredBranches}
        pagination
        highlightOnHover
        defaultSortField="name"
        responsive
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingBranch ? 'Edit Branch' : 'Add Branch'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Branch Name</Form.Label>
              <Form.Control
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-3">
              {editingBranch ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Branch;
