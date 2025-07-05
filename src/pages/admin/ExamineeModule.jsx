import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { ExamineeContext } from '../../context/ExamineeContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExamineeModule = () => {
  const {
    examinees,
    addExaminee,
    updateExaminee,
    deleteExaminee,
    toggleExamineeStatus
  } = useContext(ExamineeContext);

  const [filteredExaminees, setFilteredExaminees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    name: '', fatherName: '', motherName: '', dob: '', contact: '',
    email: '', college: '', address: '', qualification: '', enrollment: '', course: ''
  });

  useEffect(() => {
    setFilteredExaminees(examinees);
  }, [examinees]);

  const handleShowModal = (examinee = null) => {
    if (examinee) {
      setFormData(examinee);
      setEditingId(examinee._id);
    } else {
      setFormData({
        name: '', fatherName: '', motherName: '', dob: '', contact: '',
        email: '', college: '', address: '', qualification: '', enrollment: '', course: ''
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (editingId) {
      await updateExaminee(editingId, formData);
    } else {
      await addExaminee(formData);
    }
    handleCloseModal();
  };

  const exportToExcel = (data, fileName = 'Examinees') => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const exportToCSV = (data, fileName = 'Examinees') => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "60px",
      
    },
    {
      name: "Picture",
      cell: row => (
        <img
          src={row.image ? `http://localhost:5000/uploads/${row.image}` : 'https://avatar.iran.liara.run/public/10'}
          alt="pic"
          className="img-fluid rounded-circle"
          style={{ height: "60px", width: "60px" }}
        />
      )
    },
    
    { name: "Name", selector: row => row.name, sortable: true },
    { name: "Father", selector: row => row.fatherName, sortable: true },
     { name: "Email", selector: row => row.email, sortable: true },
    { name: "Branch", selector: row => row.branchId?.name, sortable: true },
    { name: "Contact", selector: row => row.contact },
    { name: "College", selector: row => row.college },
    { name: "Address", selector: row => row.address },
    { name: "Qualification", selector: row => row.qualification },
    
    {
      name: "Status",
      cell: row =>
        row.status === '1'
          ? <span className="badge bg-success">Verified</span>
          : <span className="badge bg-warning text-dark">Pending</span>
    },
    
    {
  name: "Actions",
  cell: row => (
    <>
      <Button size="sm" variant="info" onClick={() => handleView(row)}>
        <i className="fa-solid fa-eye" style={{ color: "#fff" }} />
      </Button>{' '}
      <Button size="sm" variant="warning" onClick={() => handleShowModal(row)}>
        <i className="fa-solid fa-pen-to-square" style={{ color: "#fff" }} />
      </Button>{' '}
      <Button size="sm" variant="danger" onClick={() => deleteExaminee(row._id)}>
        <i className="fa-solid fa-trash" style={{ color: "#fff" }} />
      </Button>{' '}
      <Button
        size="sm"
        variant={row.status === '1' ? "secondary" : "success"}
        onClick={() => toggleExamineeStatus(row._id, row.status)}
      >
        {row.status === '1' ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-xmark" />}
      </Button>
    </>
  )
}

  ];
  const [searchText, setSearchText] = useState('');

// Filter examinees on search text change
useEffect(() => {
  if (!searchText) {
    setFilteredExaminees(examinees);
  } else {
    const lowercasedFilter = searchText.toLowerCase();
    const filteredData = examinees.filter(item => {
      return (
        item.name?.toLowerCase().includes(lowercasedFilter) ||
        item.email?.toLowerCase().includes(lowercasedFilter) ||
        item.contact?.toLowerCase().includes(lowercasedFilter) ||
        item.fatherName?.toLowerCase().includes(lowercasedFilter) ||
        item.branchId?.name?.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredExaminees(filteredData);
  }
}, [searchText, examinees]);

const handleView = (data) => {
  setViewData(data);
  setViewModal(true);
};


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" className='h-75' onClick={() => handleShowModal()}>
          Add Examinee
        </Button>
       <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search examinees by name, email, contact..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

        <div>
          <Button
            variant="success"
            size="sm"
            className="me-2"
            onClick={() => exportToCSV(filteredExaminees)}
          >
            Export CSV
          </Button>
          <Button
            variant="info"
            size="sm"
            className="text-white"
            onClick={() => exportToExcel(filteredExaminees)}
          >
            Export Excel
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12 mx-auto">
          <DataTable
            columns={columns}
            data={filteredExaminees}
            pagination
            highlightOnHover
            defaultSortField="name"
            responsive
            
          />
        </div>
      </div>

      {/* Modal */}
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
                  value={formData[field.name] || ''}
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
      {/* student information modal */}
            <Modal show={viewModal} onHide={() => setViewModal(false)} size="lg" centered>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>Examinee Profile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {viewData && (
      <div className="p-3">
        <div className="text-center mb-4">
          <img
            src={viewData.image ? `http://localhost:5000/uploads/${viewData.image}` : 'https://avatar.iran.liara.run/public/10'}
            alt="Examinee"
            className="rounded-circle border border-3 border-primary shadow"
            style={{ height: "120px", width: "120px", objectFit: "cover" }}
          />
          <h4 className="mt-3 text-primary">{viewData.name}</h4>
          <p className="text-muted">{viewData.email}</p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <p><strong>Father's Name:</strong> {viewData.fatherName}</p>
            <p><strong>Mother's Name:</strong> {viewData.motherName}</p>
            <p><strong>Date of Birth:</strong> {viewData.dob}</p>
            <p><strong>Contact:</strong> {viewData.contact}</p>
            <p><strong>Enrollment:</strong> {viewData.enrollment}</p>
          </div>
          <div className="col-md-6">
            <p><strong>College:</strong> {viewData.college}</p>
            <p><strong>Address:</strong> {viewData.address}</p>
            <p><strong>Qualification:</strong> {viewData.qualification}</p>
            <p><strong>Course:</strong> {viewData.course}</p>
            <p><strong>Branch:</strong> {viewData.branchId?.name}</p>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className={`badge fs-6 px-4 py-2 ${viewData.status === '1' ? 'bg-success' : 'bg-warning text-dark'}`}>
            {viewData.status === '1' ? 'Verified' : 'Pending'}
          </span>
        </div>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer className="justify-content-center">
    <Button variant="secondary" onClick={() => setViewModal(false)}>Close</Button>
  </Modal.Footer>
</Modal>


    </div>
  );
};

export default ExamineeModule;
