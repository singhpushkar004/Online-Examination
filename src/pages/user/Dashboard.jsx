import React, { useState } from 'react';
// import './AdminDashboard.css';
import { Link } from 'react-router';
import {
  FaUserGraduate, FaFileAlt, FaQuestionCircle, FaClipboardList,
  FaUserShield, FaChartBar, FaBars, FaUser,FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';
import { Outlet } from 'react-router';

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaChartBar />, path: '/student/' },
    { name: 'Profile', icon: <FaUser />, path: '/student/profile' },
    { name: 'My Exam', icon: <FaUserGraduate />, path: '/student/exam' },
    { name: 'My Result', icon: <FaQuestionCircle />, path: '/student/result' },
    { name: 'Change Password', icon: <FaFileAlt />, path: '/student/change-password' },

  ];
const handleLogout = () => {
    localStorage.removeItem('ibtUser');
    localStorage.removeItem('ibtToken');
    alert("Logged out!");
    window.location.href = "/login";
  };
  return (
    <div className="admin-dashboard">
      <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-toggle ms-auto" onClick={toggleSidebar}>
          {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </div>
        <h2 className="logo cursive">{isExpanded ? 'Dashboard' : 'Dashboard'}</h2>
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="nav-link">
                <span className="icon">{item.icon}</span>
                {isExpanded && <span className="label">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="topbar d-flex justify-content-evenly">
          <h4 className='cursive'>Welcome to The Exam Prep</h4>
          <button className='btn btn-danger rounded-0' onClick={handleLogout}>Logout</button>
        </div>
        <div className="content-area">
          <Outlet/>
         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
