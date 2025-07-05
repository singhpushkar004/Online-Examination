// src/context/ExamineeContext.js
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/examinees';

export const ExamineeContext = createContext();

export const ExamineeProvider = ({ children }) => {
  const [examinees, setExaminees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExaminees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setExaminees(res.data.data);
    } catch (err) {
      console.error("Error fetching examinees", err);
    } finally {
      setLoading(false);
    }
  };

  const addExaminee = async (data) => {
    try {
      await axios.post(API_URL, data);
      fetchExaminees();
    } catch (err) {
      console.error("Error adding examinee", err);
    }
  };

  const updateExaminee = async (id, data) => {
    try {
      await axios.put(`${API_URL}/${id}`, data);
      fetchExaminees();
    } catch (err) {
      console.error("Error updating examinee", err);
    }
  };

  const deleteExaminee = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExaminees();
    } catch (err) {
      console.error("Error deleting examinee", err);
    }
  };

  const toggleExamineeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === '1' ? '0' : '1';
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: newStatus });
      fetchExaminees();
    } catch (err) {
      console.error("Error toggling examinee status", err);
    }
  };

  useEffect(() => {
    fetchExaminees();
  }, []);

  return (
    <ExamineeContext.Provider
      value={{
        examinees,
        loading,
        fetchExaminees,
        addExaminee,
        updateExaminee,
        deleteExaminee,
        toggleExamineeStatus,
      }}
    >
      {children}
    </ExamineeContext.Provider>
  );
};
