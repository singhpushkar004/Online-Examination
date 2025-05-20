import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';

const ReportGenerationModule = () => {
  const [formData, setFormData] = useState({
    examId: '',
    examineeId: '',
    marksObtained: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowModal = () => {
    setFormData({
      examId: '',
      examineeId: '',
      marksObtained: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/reports', formData);a
      alert('Report generated successfully!');
      setReports([...reports, response.data]);
      handleCloseModal();
    } catch (error) {
      console.error("Error generating report", error);
      alert("Failed to generate report");
    }
    setLoading(false);
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports');
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Report Generation</h3>
      <Button variant="success" onClick={handleShowModal}>Generate Report</Button>

      {/* Table displaying existing reports */}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Exam Title</th>
            <th>Examinee Name</th>
            <th>Marks Obtained</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? reports.map((report) => (
            <tr key={report._id}>
              <td>{report.examId.title}</td>
              <td>{report.examineeId.name}</td>
              <td>{report.marksObtained}</td>
              <td>{report.status}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center">No reports available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for generating new report */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Examination</Form.Label>
              <Form.Control
                as="select"
                name="examId"
                value={formData.examId}
                onChange={handleInputChange}
              >
                {/* Replace this with dynamic data fetched from your backend */}
                <option value="">Select Exam</option>
                <option value="exam_id_1">Exam 1</option>
                <option value="exam_id_2">Exam 2</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Examinee</Form.Label>
              <Form.Control
                as="select"
                name="examineeId"
                value={formData.examineeId}
                onChange={handleInputChange}
              >
                {/* Replace this with dynamic data fetched from your backend */}
                <option value="">Select Examinee</option>
                <option value="examinee_id_1">John Doe</option>
                <option value="examinee_id_2">Jane Doe</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Marks Obtained</Form.Label>
              <Form.Control
                type="number"
                name="marksObtained"
                value={formData.marksObtained}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={generateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportGenerationModule;
