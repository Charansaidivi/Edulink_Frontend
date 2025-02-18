import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice'; 
import axios from 'axios';
import { API_URL } from '../data/apiData';
import Navbar from '../components/Navbar';
import './ProfilePage.css';

const SessionList = ({ sessions, handleJoinSession, isTeaching }) => (
  <div className="session-list">
    {sessions.length > 0 ? (
      sessions.map((session) => (
        <div key={session._id} className="session-item">
          <h4>{session.topicName}</h4>
          <button onClick={() => handleJoinSession(session.meetingLink)}>
            {isTeaching ? 'Start Class' : 'Join'}
          </button>
        </div>
      ))
    ) : (
      <p>No sessions available.</p>
    )}
  </div>
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profileImage, username, email, enrolledSessions, teachingSessions } = useSelector((state) => state.profile);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [teachingSessionDetails, setTeachingSessionDetails] = useState([]);
  const [showEnrolled, setShowEnrolled] = useState(false);
  const [showTeaching, setShowTeaching] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('loginToken') ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId : "";

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${API_URL}/student/profile/${userId}`);
          dispatch(setProfile(response.data));
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        if (showEnrolled) {
          const response = await axios.post(`${API_URL}/student/sessions/details`, { sessionIds: enrolledSessions });
          setSessionDetails(response.data);
        }
        if (showTeaching) {
          const response = await axios.post(`${API_URL}/student/sessions/details`, { sessionIds: teachingSessions });
          setTeachingSessionDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [showEnrolled, showTeaching, enrolledSessions, teachingSessions]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('media', file);

      try {
        const response = await axios.post(`${API_URL}/student/upload/${userId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(setProfile({ profileImage: response.data.profileImage }));
        alert("Profile updated successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleJoinSession = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('loginToken');
    dispatch(setProfile({}));
    window.location.href = '/';
  };

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-page">
          <div className="profile-container">
            <div className="profile-image-wrapper">
              <img 
                src={profileImage ? `${API_URL}/uploads/${profileImage}` : '/default.jpg'} 
                alt="Profile" 
                className="profile-image" 
              />
              <input 
                type="file" 
                id="file-upload" 
                onChange={handleImageUpload} 
                className="file-input" 
              />
              <label htmlFor="file-upload" className="edit-icon">✎</label>
            </div>
          </div>  
          <div className="profile-info">
            <h2>{username}</h2>
            <p>{email}</p>
          </div>
          
          <button onClick={() => setShowEnrolled(!showEnrolled)}>
            {showEnrolled ? 'Hide Enrolled Sessions' : 'Show Enrolled Sessions'}
          </button>
          {showEnrolled && (
            <div className="enrolled-sessions">
              <h3>My Enrolled Sessions</h3>
              {loading ? <p>Loading...</p> : <SessionList sessions={sessionDetails} handleJoinSession={handleJoinSession} isTeaching={false} />}
            </div>
          )}

          <button onClick={() => setShowTeaching(!showTeaching)}>
            {showTeaching ? 'Hide Teaching Sessions' : 'Show Teaching Sessions'}
          </button>
          {showTeaching && (
            <div className="teaching-sessions">
              <h3>Teaching Sessions</h3>
              {loading ? <p>Loading...</p> : <SessionList sessions={teachingSessionDetails} handleJoinSession={handleJoinSession} isTeaching={true} />}
            </div>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;