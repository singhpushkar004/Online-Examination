import React, { useEffect, useState } from 'react';
import { Table, Card } from 'react-bootstrap';
import axios from 'axios';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const student = JSON.parse(localStorage.getItem('ibtUser'));

  useEffect(() => {
    if (student && student._id) {
      axios.get(`http://localhost:5000/api/results/student/${student._id}`)
        .then(res => setResults(res.data))
        .catch(err => console.error('Error fetching results:', err));
    }
  }, [student]);

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <h4 className="mb-4 text-primary">📝 My Results</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Exam Title</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Total Marks</th>
                <th>Status</th>
                <th>Date Attempted</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? results.map((res, idx) => (
                <tr key={idx}>
                  <td>{res.examTitle}</td>
                  <td>{res.subject}</td>
                  <td>{res.score}</td>
                  <td>{res.totalMarks}</td>
                  <td style={{ color: res.status === 'Pass' ? 'green' : 'red' }}>{res.status}</td>
                  <td>{new Date(res.date).toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center">No results found</td></tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MyResults;
