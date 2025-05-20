import React, { useEffect, useState } from 'react';
// import './AdminDashboard.css';
import { Link, useNavigate } from 'react-router';
import {
  FaUserGraduate, FaFileAlt, FaQuestionCircle, FaClipboardList,
  FaUserShield, FaChartBar, FaBars, FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';
import { Outlet } from 'react-router';

const AdminDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const validate =()=>{
    if(!localStorage.getItem('admin')){
      navigate('/adlogin');
    }
  }
useEffect(()=>{
validate();
},[]);


  const menuItems = [
    { name: 'Dashboard', icon: <FaChartBar />, path: '/admin/' },
    { name: 'Examinee Info', icon: <FaUserGraduate />, path: '/admin/examini' },
    { name: 'Question Bank', icon: <FaQuestionCircle />, path: '/admin/question' },
    { name: 'Examination', icon: <FaClipboardList />, path: '/admin/examination' },
    { name: 'Report Generation', icon: <FaFileAlt />, path: '/admin/reports' },
    { name: 'Administrator', icon: <FaUserShield />, path: '/admin/administrator' },
    { name: 'Marks Upload', icon: <FaUserShield />, path: '/admin/marks' }

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
          <div className='text-end pe-5'>
          <Link to={'/adlogin'} onClick={()=>{
            localStorage.removeItem('admin');
          }} className='btn btn-sm btn-danger'>Logout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
