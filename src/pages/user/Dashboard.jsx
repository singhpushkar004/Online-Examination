import React, { useState } from 'react';
// import './AdminDashboard.css';
import { Link } from 'react-router';
import {
  FaUserGraduate, FaFileAlt, FaQuestionCircle, FaClipboardList,
  FaUserShield, FaChartBar, FaBars, FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';
import { Outlet } from 'react-router';

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaChartBar />, path: '/student/' },
  
    { name: 'My Exam', icon: <FaUserGraduate />, path: '/student/exam' },
    { name: 'My Result', icon: <FaQuestionCircle />, path: '/student/result' },
    { name: 'Logout', icon: <FaClipboardList />, path: '/student/logout' },
   

  ];

  return (
    <div className="admin-dashboard">
      <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </div>
        <h2 className="logo">{isExpanded ? 'IBT Admin' : 'IBT'}</h2>
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
        <div className="topbar">
          <h4>Welcome Admin</h4>
        </div>
        <div className="content-area">
          <Outlet/>
         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
