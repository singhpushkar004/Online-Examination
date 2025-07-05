import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";

const ExamAttemptTable = () => {
  const [attempts, setAttempts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [filterText, setFilterText] = useState("");
const [branchFilter, setBranchFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/exams").then((res) => setAttempts(res.data));
  }, []);

  const handleEdit = (attempt) => {
    setSelected(attempt);
    setShow(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`http://localhost:5000/api/exams/${id}`).then(() => {
        setAttempts(attempts.filter((a) => a._id !== id));
      });
    }
  };

  const handlePrint = (attempt) => {
    const printWindow = window.open("", "_blank");
    const html = `
      <html>
        <head>
          <title>Exam Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #000; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h2>Exam Report</h2>
          <table>
            <tr><th>Student Name</th><td>${attempt.studentId?.name || "N/A"}</td></tr>
            <tr><th>Exam Title</th><td>${attempt.examId?.title || "N/A"}</td></tr>
            <tr><th>Score</th><td>${attempt.score}</td></tr>
            <tr><th>Total Marks</th><td>${attempt.totalMarks}</td></tr>
            <tr><th>Passing Marks</th><td>${attempt.passingMarks}</td></tr>
            <tr><th>Attempted At</th><td>${new Date(attempt.attemptedAt).toLocaleString()}</td></tr>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/api/exams/${selected._id}`, selected)
      .then((res) => {
        setAttempts(attempts.map((a) => (a._id === res.data._id ? res.data : a)));
        setShow(false);
      });
  };

  // Filter attempts by search text
  const filteredAttempts = attempts.filter((attempt) => {
  const matchesSearch =
    (attempt.studentId?.name || "")
      .toLowerCase()
      .includes(filterText.toLowerCase()) ||
    (attempt.examId?.title || "")
      .toLowerCase()
      .includes(filterText.toLowerCase());

  const matchesBranch =
    branchFilter === "" || attempt.examId?.branchId === branchFilter;

  return matchesSearch && matchesBranch;
});

// console.log(attempts);
// filter the attempts exam data


  // Define columns for react-data-table-component
  const columns = [
    {
      name: "S No",
      selector: (row, index) => index + 1,
      width: "70px",
      sortable: false,
    },
    {
      name: "Student",
      selector: (row) => row.studentId?.name || "N/A",
      sortable: true,
    },
    {
      name: "Exam",
      selector: (row) => row.examId?.title || "N/A",
      sortable: true,
    },
    {
      name: "Score",
      selector: (row) => row.score,
      sortable: true,
      right: true,
    },
    {
      name: "Total",
      selector: (row) => row.totalMarks,
      sortable: true,
      right: true,
    },
    {
      name: "Passing",
      selector: (row) => row.passingMarks,
      sortable: true,
      right: true,
    },
    {
      name: "Attempted At",
      selector: (row) => new Date(row.attemptedAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button size="sm" variant="success" onClick={() => handleEdit(row)} className="me-1">
            <i className="fa fa-edit"></i>
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(row._id)}
            className="me-1"
          >
            <i className="fa fa-trash"></i>
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handlePrint(row)}>
            Print
          </Button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "160px",
    },
  ];

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Examination Marks</h3>

      {/* Search input */}
      <Form.Control
        type="text"
        placeholder="Search by student or exam..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ maxWidth: "300px", marginBottom: "10px" }}
      />
      <Form.Select
        value={branchFilter}
        onChange={(e) => setBranchFilter(e.target.value)}
        style={{ maxWidth: "300px", marginBottom: "10px" }}
      >
        <option value="">All Branches</option>
        {attempts?.map((b) => (
                          <option key={b.examId?._branchId} value={b.examId?.branchId}>
                            {b.examId?.branchId.name}
                            {console.log(b.examId.branchId)}
                          </option>
                          
                        ))}
        {/* Add actual branch _ids from your DB */}
      </Form.Select>


      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredAttempts}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        noHeader
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 20]}
      />

      {/* Edit Modal */}
      {selected && (
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Attempt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Score</Form.Label>
                <Form.Control
                  type="number"
                  value={selected.score}
                  onChange={(e) => setSelected({ ...selected, score: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total Marks</Form.Label>
                <Form.Control
                  type="number"
                  value={selected.totalMarks}
                  onChange={(e) => setSelected({ ...selected, totalMarks: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Passing Marks</Form.Label>
                <Form.Control
                  type="number"
                  value={selected.passingMarks}
                  onChange={(e) => setSelected({ ...selected, passingMarks: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ExamAttemptTable;
