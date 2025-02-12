import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileImage } from '../redux/profileSlice'
import Pattern from '../components/Pattern'
import Navbar from '../components/Navbar' // Adjust the path as necessary
import axios from 'axios'; // Import axios for API calls
import { API_URL } from '../data/apiData';

const ProfilePage = () => {
  const dispatch = useDispatch()
  const profileImageFromStore = useSelector((state) => state.profile.profileImage)
  const [enrolledSessions, setEnrolledSessions] = useState([]); // State for enrolled sessions
  const [teachingSessions, setTeachingSessions] = useState([]); // State for teaching sessions
  const [username, setUsername] = useState(''); // State for username
  const [email, setEmail] = useState(''); // State for email
  const [ratings, setRatings] = useState(0); // State for ratings
  const userId = localStorage.getItem('loginToken') ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId : ""; // Extract userId from loginToken
  console.log(userId);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/student/profile/${userId}`); // Fetch user profile
        console.log(response);
        const { profileImage, enrolledSessions = [], teachingSessions = [], email, username, ratings } = response.data;
        console.log(teachingSessions) // Destructure response with defaults
        setUsername(username); // Set username
        setEmail(email); // Set email
        setRatings(ratings); // Set ratings
        setEnrolledSessions(enrolledSessions); // Set enrolled sessions
        setTeachingSessions(teachingSessions); // Set teaching sessions
        dispatch(setProfileImage(profileImage)); // Dispatch action to set profile image in Redux
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile(); // Call the function to fetch user profile
  }, [userId, dispatch]);

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
            <img src={profileImageFromStore ? `${API_URL}/uploads/${profileImageFromStore}` : '/default.jpg'} alt="Profile" className="profile-image" />
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