import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice';
import { API_URL } from '../data/apiData';
import 'boxicons/css/boxicons.min.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bodyPd, setBodyPd] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('sidebarState') === 'open';
  });
  const [activeNav, setActiveNav] = useState("home");
  const profileImageFromStore = useSelector((state) => state.profile.profileImage);

  // Effect to apply sidebar state on mount and state changes
  useEffect(() => {
    const nav = document.getElementById('nav-bar');
    const toggle = document.getElementById('header-toggle');
    const bodypdEl = document.getElementById('body-pd');
    const header = document.getElementById('header');
    const headerToggle = document.querySelector('.header_toggle');

    if (bodyPd) {
      nav.classList.add('show');
      toggle.classList.add('bx-x');
      headerToggle.classList.add('expanded');
      bodypdEl.classList.add('body-pd');
      header.classList.add('body-pd');
      document.body.classList.add('nav-expanded');
    } else {
      nav.classList.remove('show');
      toggle.classList.remove('bx-x');
      headerToggle.classList.remove('expanded');
      bodypdEl.classList.remove('body-pd');
      header.classList.remove('body-pd');
      document.body.classList.remove('nav-expanded');
    }
  }, [bodyPd]);

  const handleLogout = () => {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('sidebarState'); // Clear sidebar state on logout
    dispatch(setProfile({}));
    navigate('/login');
  };

  const handleToggle = () => {
    const newState = !bodyPd;
    setBodyPd(newState);
    // Save state to localStorage
    localStorage.setItem('sidebarState', newState ? 'open' : 'closed');
  };

  return (
    <div className="navbar-container" id="body-pd">
      <header className="header" id="header">
        <div className="header_toggle">
          <i className='bx bx-menu' id="header-toggle" onClick={handleToggle}></i>
        </div>
        <div className="header_img" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <img
            src={profileImageFromStore ? `${API_URL}/uploads/user_profiles/${profileImageFromStore}` : '/default.jpg'}
            alt="Profile"
            className="navbar-profile-image"
          />
        </div>
      </header>
      <div className={`l-navbar ${bodyPd ? 'show' : ''}`} id="nav-bar">
        <nav className="nav">
          <div>
            <Link to="/home"
              className="nav_logo"
              onClick={() => { setActiveNav("home"); }}
            >
              <img src="/logo1.png" alt="Logo" className="nav_logo-icon" />
            </Link>
            <div className="nav_list">
              <NavLink
                to="/home"
                className={({ isActive }) => `nav_link ${isActive ? "active" : ""}`}
              >
                <i className='bx bx-book-reader nav_icon'></i>
                <span className="nav_name">Book Class</span>
              </NavLink>
              <NavLink
                to="/create-class"
                className={({ isActive }) => `nav_link ${isActive ? "active" : ""}`}
              >
                <i className='bx bx-add-to-queue nav_icon'></i>
                <span className="nav_name">Create Class</span>
              </NavLink>
              <NavLink
                to="/about-us"
                className={({ isActive }) => `nav_link ${isActive ? "active" : ""}`}
              >
                <i className='bx bx-info-circle nav_icon'></i>
                <span className="nav_name">About Us</span>
              </NavLink>
              <div
                className={`nav_link project_dropdown`}
              >
                <i className='bx bx-group nav_icon'></i>
                <span className="nav_name">Project Discussion</span>
                <i className='bx bx-chevron-down dropdown_icon'></i>
                <div className="dropdown_menu">
                  <NavLink
                    to="/leader"
                    className={({ isActive }) => `dropdown_item ${isActive ? "active" : ""}`}
                  >
                    <i className='bx bx-crown'></i>
                    <span>Leader</span>
                  </NavLink>
                  <NavLink
                    to="/member"
                    className={({ isActive }) => `dropdown_item ${isActive ? "active" : ""}`}
                  >
                    <i className='bx bx-user'></i>
                    <span>Member</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div>
            <a onClick={handleLogout} className="nav_link">
              <i className='bx bx-log-out nav_icon'></i>
              <span className="nav_name">Logout</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;