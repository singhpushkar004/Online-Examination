import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';

const MarksUploadModule = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setVariant('danger');
      setMessage('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/marks/upload', formData);
      setVariant('success');
      setMessage(res.data.message);
    } catch (error) {
      console.error('Upload failed:', error);
      setVariant('danger');
      setMessage(error?.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setFile(null); // reset file input
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-3">Bulk Upload Marks via CSV</h3>

      {message && <Alert variant={variant}>{message}</Alert>}

      <Form.Group controlId="formFile">
        <Form.Label>Select CSV File</Form.Label>
        <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
      </Form.Group>

      <Button className="mt-3" onClick={handleUpload} disabled={uploading}>
        {uploading ? <><Spinner size="sm" animation="border" /> Uploading...</> : 'Upload Marks'}
      </Button>

      <p className="mt-3 text-muted">
        CSV Format: <code>studentId,subject,marks</code>
      </p>
    </div>
  );
};

export default MarksUploadModule;
