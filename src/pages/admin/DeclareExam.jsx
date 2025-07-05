import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/examinations';
const SESSION_API = 'http://localhost:5000/api/sessions';
const BRANCH_API = 'http://localhost:5000/api/branches';
const examDeclare = 'http://localhost:5000/api/exams/declare/'
const DeclareExam = () => {
  const [examinations, setExaminations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects , setSubjects] = useState([]);
  const [attempt , setAttempts] = useState([]);
  

  useEffect(() => {
    fetchExaminations();
    fetchSessions();
    fetchBranches();
    fetchSubject();
    fetchAttemptedExam();
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
  const fetchSubject = async () =>{
    const res = await axios.get('http://localhost:5000/api/subjects');
    setSubjects(res.data);
    // console.log(res.data);
    
  };
  const fetchBranches = async () => {
    const res = await axios.get(BRANCH_API);
    setBranches(res.data);
  };
  const saveResult = async (id)=>{
    const res = await axios.put(`http://localhost:5000/api/exams/declare/${id}`);
    if(res.data){
       alert(res.data.message)
       location.reload();
    }
  }
  const fetchAttemptedExam = async()=>{
    const res = await axios.get('http://localhost:5000/api/exams');
    setAttempts(res.data);
    // console.log(res.data);
    fetchExaminations();

  }
 
  return (
    <div className="container mt-4">
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr className='table-dark'>
            <th>S.N</th>
            <th>Title</th>
            <th>Subject</th>
            <th>Branch</th>
            <th>Date</th>
            <th>Result</th>
          </tr>
        </thead>
       <tbody>
  {examinations
   
    .map((exam, i) => (
      <tr key={exam._id}>
        <td>{i + 1}</td>
        <td>{exam.title}</td>
        <td>{exam.subjectId?.name}</td>
        <td>{exam.branchId?.name}</td>
        <td>{new Date(exam.date).toLocaleDateString()}</td>
        <td>
          {attempt.some(
            (a) => a.examId._id === exam._id && a.status === '1'
          ) ? (
            <span className="text-success fw-semibold">Declared </span>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={() => saveResult(exam._id)}
            >
              Declare
            </Button>
          )}
        </td>
      </tr>
    ))}
</tbody>


      </Table>

     
    </div>
  );
};

export default DeclareExam;
