import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice'; // Import the action to set profile
import axios from 'axios';
import { API_URL } from '../data/apiData';
import Pattern from '../components/Pattern'
import Navbar from '../components/Navbar' // Adjust the path as necessary
import './ProfilePage.css'

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profileImage, username, email, ratings, enrolledSessions, teachingSessions } = useSelector((state) => state.profile);
  
  const userId = localStorage.getItem('loginToken') ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId : "";

  useEffect(() => {
    // Check if profile data is already in Redux state
    if (!username) { // Assuming username is a key part of the profile
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
  }, [dispatch, username, userId]); // Dependency array includes dispatch, username, and userId

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('media', file); // Append the file to the form data

      try {
        const response = await axios.post(`${API_URL}/student/upload/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        dispatch(setProfile({ profileImage: response.data.profileImage })); // Update Redux state with new profile image
        alert("Profile updated successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <Pattern>
      <Navbar />
      <div className="profile-wrapper"> {/* New wrapper div */}
        <div className="profile-page"> {/* Profile page content */}
          <div className="profile-container">
            <img 
              src={profileImage ? `${API_URL}/uploads/${profileImage}` : '/default.jpg'} 
              alt="Profile" 
              className="profile-image" 
            />
          </div>  
          <div className="profile-info">
            <h2>{username}</h2>
            <p>{email}</p>

          </div>
          <input type="file" onChange={handleImageUpload} />
          <div className="enrolled-sessions">
            <h3>My Enrolled Sessions</h3>
            {enrolledSessions.length > 0 ? (
              enrolledSessions.map((sessionItem) => (
                <div key={sessionItem._id}>
                  <h4>{sessionItem.name}</h4>
                </div>
              ))
            ) : (
              <p>No enrolled sessions yet.</p>
            )}
          </div>
          <div className="teaching-sessions">
            <h3>Teaching Sessions</h3>
            {teachingSessions.length > 0 ? (
              teachingSessions.map((sessionItem) => (
                <div key={sessionItem._id}>
                  <h4>{sessionItem.name}</h4>
                </div>
              ))
            ) : (
              <p>No teaching sessions yet.</p>
            )}
          </div>
        </div>
      </div> {/* End of new wrapper div */}
    </Pattern>
  );
};

export default ProfilePage