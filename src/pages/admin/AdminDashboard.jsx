import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import {
  FaUserGraduate, FaFileAlt, FaQuestionCircle, FaClipboardList,
  FaUserShield, FaChartBar, FaAngleDoubleLeft, FaAngleDoubleRight,
  FaRegCalendarAlt, FaBookOpen, FaEnvelope, FaUpload, FaSitemap
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (!localStorage.getItem('admin')) {
      navigate('/adlogin');
    }

    const handleResize = () => {
      setIsExpanded(window.innerWidth > 768);
    };

    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const menuItems = [
    { name: 'Dashboard', icon: <FaChartBar />, path: '/admin/' },
    { name: 'Session', icon: <FaRegCalendarAlt />, path: '/admin/session' },
    { name: 'Branch', icon: <FaSitemap />, path: '/admin/branch' },
    { name: 'Subject', icon: <FaBookOpen />, path: '/admin/subject' },
    { name: 'Examination', icon: <FaClipboardList />, path: '/admin/examination' },
    { name: 'Examinee Info', icon: <FaUserGraduate />, path: '/admin/examini' },
    { name: 'Question Bank', icon: <FaQuestionCircle />, path: '/admin/question' },
    { name: 'Report Generation', icon: <FaFileAlt />, path: '/admin/reports' },
    { name: 'Administrator', icon: <FaUserShield />, path: '/admin/administrator' },
    { name: 'Message', icon: <FaEnvelope />, path: '/admin/message' },
    { name: 'Marks Upload', icon: <FaUpload />, path: '/admin/marks' },
    { name: 'Declare Result', icon: <FaUpload />, path: '/admin/result' },
  ];

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-toggle ms-auto" onClick={toggleSidebar}>
          {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </div>
        <h2 className="logo">{isExpanded ? 'Admin Dashboard' : 'Admin'}</h2>
        <ul className="nav-list">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link to={item.path} className="nav-link">
                <span className="icon">{item.icon}</span>
                {isExpanded && <span className="label">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar d-flex justify-content-between align-items-center">
          <h4>Welcome Admin</h4>
          <Link
            to="/adlogin"
            className="btn btn-sm btn-danger"
            onClick={() => localStorage.removeItem('admin')}
          >
            Logout
          </Link>
        </header>

        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
