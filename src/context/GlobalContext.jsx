// src/context/GlobalContext.js
import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router";
const API_URL = "http://localhost:5000/api";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
   const [counts, setCounts] = useState();
  const [session, setSessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get(`${API_URL}/count`);
        setCounts(res1.data);

        const res2 = await axios.get(`${API_URL}/sessions`)
          if(res2.data.activeSessionId){
            Navigate(`/session/${res2.data.activeSessionId}`);
          }
        
        setSessions(res2.data);

        // for the total no. of user
         const res3 = await axios.get(`${API_URL}/count`);
        setCounts(res3.data);

      } catch (error) {
        toast.error("Global data fetch failed");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <GlobalContext.Provider value={{ counts, session }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook for easy access
export const useGlobalData = () => useContext(GlobalContext);
