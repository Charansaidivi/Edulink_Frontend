import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
const LandingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid" id="navbar">
        <img
          src="/logo1.png"
          alt="Logo"
          className="navbar-logo"
        />
        {/* Toggle Button for Small Screens */}
        <input
          type="checkbox"
          className="check-icon"
          id="check-icon"
          name="check-icon"
          onChange={toggleMenu}
        />
        <label className="icon-menu" htmlFor="check-icon">
          <div className="bar bar--1"></div>
          <div className="bar bar--2"></div>
          <div className="bar bar--3"></div>
        </label>
        {/* Navbar Links and Buttons */}
        <div className={`navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 justify-content-center">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/home">Landing Page</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/about-us">About Us</a>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
