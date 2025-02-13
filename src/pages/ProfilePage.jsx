import React from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import { useDispatch } from 'react-redux';
import { setProfileImage } from '../redux/profileSlice'
import Pattern from '../components/Pattern'
import Navbar from '../components/Navbar' // Adjust the path as necessary
import axios from 'axios'; // Import axios for API calls
import { API_URL } from '../data/apiData';
import './ProfilePage.css'

const ProfilePage = () => {
  const dispatch = useDispatch()
  // Access profile data from Redux
  const { profileImage, username, email, ratings, enrolledSessions, teachingSessions } = useSelector((state) => state.profile);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('media', file); // Append the file to the form data

      try {
        const response = await axios.post(`${API_URL}/student/upload/${localStorage.getItem('loginToken') ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId : ""}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        dispatch(setProfileImage(response.data.profileImage)); // Update Redux state with new profile image
        alert("profile updated sucessfully")
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
            <p>Ratings: {ratings}</p>
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