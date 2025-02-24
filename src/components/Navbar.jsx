import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice';
import { API_URL } from '../data/apiData';
import axios from 'axios';

const Navbar = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const profileImageFromStore = useSelector((state) => state.profile.profileImage);
  const username = useSelector((state) => state.profile.username);

  useEffect(() => {
    const userId = localStorage.getItem('loginToken') ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId : "";

    if (!username) {
      const fetchUserProfile = async () => {
        if (userId) {
          try {
            const response = await axios.get(`${API_URL}/student/profile/${userId}`);
            const userProfile = response.data;
            dispatch(setProfile(userProfile));
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      };

      fetchUserProfile();
    }
  }, [dispatch, username]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('loginToken');
    dispatch(setProfile({}));
    navigate('/login');
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
        {/* Navbar Links and Profile */}
        <div className={`navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 justify-content-center">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/home">Book Class</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/create-class">Create Class</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/about-us">About Us</a>
            </li>
          </ul>
          <div className="profile-container">
            <button className="profile-button" onClick={() => navigate('/profile')}>
              <img
                src={profileImageFromStore ? `${API_URL}/uploads/${profileImageFromStore}` : '/default.jpg'}
                alt="Profile"
                className="profile-image"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;