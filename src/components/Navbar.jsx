import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch to dispatch actions
import { setProfile } from '../redux/profileSlice'; // Import the action to set profile
import { API_URL } from '../data/apiData'; // Import API_URL
import axios from 'axios'; // Import axios for API calls
// import "./Navbar.css"; // Import the CSS file for styles

const Navbar = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const profileImageFromStore = useSelector((state) => state.profile.profileImage); // Get profile image from Redux state
  const username = useSelector((state) => state.profile.username); // Get username from Redux state

  useEffect(() => {
    const userId = localStorage.getItem('loginToken') ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId : "";

    // Check if username is already in Redux state
    if (!username) {
      const fetchUserProfile = async () => {
        if (userId) {
          try {
            const response = await axios.get(`${API_URL}/student/profile/${userId}`); // Fetch user profile
            const userProfile = response.data; // Assuming the response contains the full user profile
            dispatch(setProfile(userProfile)); // Store the entire profile in Redux
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      };

      fetchUserProfile(); // Call the function to fetch user profile
    }
  }, [dispatch, username]); // Dependency array includes dispatch and username

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the state
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" >
      <div className="container-fluid" id="navbar">
        <img
          src="/assets/sai.png" // Path to the image in the public directory
          alt="Logo"
          className="navbar-logo"
        />
        <input type="checkbox" id="checkbox" onChange={toggleMenu} />
        <label htmlFor="checkbox" className="toggle">
          <div className="bar bar--top"></div>
          <div className="bar bar--middle"></div>
          <div className="bar bar--bottom"></div>
        </label>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarTogglerDemo01">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 justify-content-center">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/create-class">Create Class</a>
            </li>
          </ul>
          <div className="profile-container">
            <button className="profile-button" onClick={()=>navigate('/profile')}>
              <img
                src={profileImageFromStore ? `${API_URL}/uploads/${profileImageFromStore}` : '/default.jpg'} // Use profile image from Redux state
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