import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SessionMgmt = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState({
    sessionName: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState({
    sessionName: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setFormData({
        sessionName: selectedSession.sessionName,
        description: selectedSession.description,
        startDate: selectedSession.startDate?.slice(0, 10),
        endDate: selectedSession.endDate?.slice(0, 10)
      });
      setErrors({ sessionName: '', description: '', startDate: '', endDate: '' });
    }
  }, [selectedSession]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sessions');
      setSessions(res.data.filter(s => s.status !== 'delete'));
    } catch (err) {
      console.error(err);
      alert('Failed to fetch sessions');
    }
  };

  // Validation helper
  const validateField = (name, value) => {
    switch (name) {
      case 'sessionName':
        // Example pattern: YYYY-YY or 4digits-2digits (like 2025-26)
        const pattern = /^\d{4}-\d{2}$/;
        if (!value) return 'Session Name is required';
        if (!pattern.test(value)) return 'Session Name must be like "2025-26"';
        return '';
      case 'description':
        if (!value) return 'Description is required';
        return '';
      case 'startDate':
        if (!value) return 'Start Date is required';
        return '';
      case 'endDate':
        if (!value) return 'End Date is required';
        if (formData.startDate && value < formData.startDate) return 'End Date cannot be before Start Date';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate this field & update errors
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));

    // Extra: If endDate changes, also revalidate startDate (in case endDate < startDate)
    if (name === 'startDate' && formData.endDate) {
      setErrors(prev => ({
        ...prev,
        endDate: validateField('endDate', formData.endDate)
      }));
    }
    if (name === 'endDate' && formData.startDate) {
      setErrors(prev => ({
        ...prev,
        endDate: validateField('endDate', value)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);

    // If any error message exists, return false
    return !Object.values(newErrors).some(err => err.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if form invalid
    }

    try {
      if (selectedSession) {
        await axios.put(`http://localhost:5000/api/sessions/${selectedSession._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/sessions', formData);
      }
      setFormData({ sessionName: '', description: '', startDate: '', endDate: '' });
      setSelectedSession(null);
      fetchSessions();
      setErrors({ sessionName: '', description: '', startDate: '', endDate: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting form');
    }
  };

  const handleActivate = async (id) => {
    await axios.put(`http://localhost:5000/api/sessions/activate/${id}`);
    fetchSessions();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Mark this session as deleted?')) {
      await axios.delete(`http://localhost:5000/api/sessions/${id}`);
      fetchSessions();
    }
  };

  const clearSelected = () => {
    setSelectedSession(null);
    setFormData({ sessionName: '', description: '', startDate: '', endDate: '' });
    setErrors({ sessionName: '', description: '', startDate: '', endDate: '' });
  };

  return (
    <div className="container ">
      
      <div className="row">
        <div className="col-sm-12 mx-auto">
            {/* Session Form */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3 text-blue">➕{selectedSession ? 'Edit Session' : 'Add New Session'}</h5>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label text-blue">Session Name</label>
            <input
              type="text"
              className={`form-control ${errors.sessionName ? 'is-invalid' : ''}`}
              name="sessionName"
              value={formData.sessionName}
              onChange={handleChange}
              placeholder="Ex-2025-26"
              required
            />
            {errors.sessionName && (
              <div className="invalid-feedback">{errors.sessionName}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label text-blue">Description</label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-blue">Start Date</label>
              <input
                type="date"
                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              {errors.startDate && (
                <div className="invalid-feedback">{errors.startDate}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-blue">End Date</label>
              <input
                type="date"
                className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
              {errors.endDate && (
                <div className="invalid-feedback">{errors.endDate}</div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              {selectedSession ? 'Update Session' : 'Add Session'}
            </button>
            {selectedSession && (
              <button className="btn btn-secondary" type="button" onClick={clearSelected}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-10 mx-auto">
            {/* Session List */}
      <div className="card shadow-sm p-4">
        <h5 className="mb-3 text-blue">Session List</h5>
       <div className="table-responsive">
         <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr className='table-dark'>
                <th>S No.</th>
              <th>Name</th>
              <th>Description</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s,i) => (
              <tr key={s._id}>
                <td>{i+1}</td>
                <td>{s.sessionName}</td>
                <td>{s.description}</td>
                <td>{new Date(s.startDate).toLocaleDateString()}</td>
                <td>{new Date(s.endDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge bg-${s.status === 'active' ? 'success' : s.status === 'inactive' ? 'warning' : 'danger'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-info me-1" onClick={() => setSelectedSession(s)}>Edit</button>
                  <button className="btn btn-sm btn-success me-1" onClick={() => handleActivate(s._id)}>Activate</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">No sessions found</td>
              </tr>
            )}
          </tbody>
        </table>
       </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default SessionMgmt;
