import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router";
import { toast } from "react-toastify";
import AdminCalendar from "../../components/AdminCalendar";
import { useGlobalData } from "../../context/GlobalContext";
const API_URL = "http://localhost:5000/api";

const DashboardCard = ({ title, description, icon, total, link }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="col-xl-4 col-md-6 mb-4 cursive"
    
  >
    <Link to={link} className="text-decoration-none text-dark">
      <div className="card shadow-sm rounded-4 h-100 p-4 bg-white" style={{"borderTop":"7px solid #08064f"}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fs-1">{icon}</span>
          <span className="fs-4 fw-semibold text-primary">{total}</span>
        </div>
        <h5 className="fw-bold mb-2">{title}</h5>
        <p className="text-muted mb-0">{description}</p>
      </div>
    </Link>
  </motion.div>
);

const AdminHome = () => {
 
   const {session , counts } = useGlobalData();
  if(session.length ===0){
    return <div>Loading Data..</div>
  }


  const [sessions, setSessions] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
  

    const fetchSessions = async () => {
      try {
        const res = await axios.get(`${API_URL}/sessions`);
        setSessions(res.data);
        const active = res.data.find((s) => s.status === "active");
        if (active) {
          setActiveId(active._id);
          setSelectedId(active._id);
        }
      } catch (err) {
        toast.error("Failed to load sessions");
      }
    };

   
    fetchSessions();
    // useGlobalData();
  }, []);

  const activateSession = async () => {
    if (!selectedId) return toast.warning("Please select a session");
    try {
      await axios.put(`${API_URL}/sessions/activate/${selectedId}`);
      toast.success("Session activated successfully");
      setActiveId(selectedId);
      location.reload()
    } catch (err) {
      toast.error("Activation failed");
    }
  };
// console.log(counts)
  const dashboardItems = [
    {
      title: "Total Students",
      total: counts.students,
      description: "Add, modify, or delete student records",
      icon: "👨‍🎓",
      link: "/admin/examini",
    },
    {
      title: "Total Questions",
      total: counts.questions,
      description: "Create and organize the question bank",
      icon: "📚",
      link: "/admin/question",
    },
    {
      title: "Conduct Exams",
      total: counts.exams,
      description: "Schedule and manage online tests",
      icon: "📝",
      link: "/admin/examination",
    },
  ];

  return (
    <div className="container py-5">
      {/* Widgets Row */}
      <div className="row g-4 mb-4">
        {/* Calendar Widget */}
        <div className="col-lg-4 col-md-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card shadow-sm  rounded-4  cursive"
            style={{"borderTop":"7px solid #08064f"}}
          >
            <h5 className="fw-bold text-center mb-3">📅 Calendar</h5>
            <AdminCalendar className="w-100"/>
          </motion.div>
        </div>

        {/* Session Selector */}
        <div className="col-lg-4 col-md-6 cursive">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card shadow-sm rounded-4 p-4 h-100"
            style={{"borderTop":"7px solid #08064f"}}
          >
            <h5 className="fw-bold text-center mb-3">🔁 Session Manager</h5>
            <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center">
              <select
                className="form-select "
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">-- Select Session --</option>
                {sessions
                  .filter((s) => s.status !== "delete")
                  .map((session) => (
                    <option key={session._id} value={session._id}>
                      {session.sessionName} (
                      {new Date(session.startDate).toLocaleDateString()} -{" "}
                      {new Date(session.endDate).toLocaleDateString()})
                    </option>
                  ))}
              </select>
              <button className="btn btn-success" onClick={activateSession}>
                Activate
              </button>
            </div>
           <div className="row">
            <div className="col-sm-8">
               {activeId && (
              <p className="mt-3 text-success">
                ✅ Active Session:{" "}
                <strong>
                  {sessions.find((s) => s._id === activeId)?.sessionName}
                </strong>
              </p>
            )}
            <h6>Available Session: {session.length}</h6>
            </div>
            <div className="col-sm-6"></div>
           </div>
          </motion.div>
        </div>
      </div>

      {/* Dashboard Metrics Cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            total={item.total}
            link={item.link}
            
          />
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
