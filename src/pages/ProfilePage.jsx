import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice'; 
import axios from 'axios';
import { API_URL } from '../data/apiData';
import Navbar from '../components/Navbar';
import CountdownTimer from '../components/CountdownTimer';
import './ProfilePage.css';

const SessionList = ({ sessions, handleJoinSession }) => (
  <div className="session-list">
    {sessions.length > 0 ? (
      sessions.map((session) => {
        const startDateTime = new Date(`${session.startDate.split('T')[0]}T${session.startTime}:00Z`).toISOString();
        const endDateTime = new Date(`${session.endDate.split('T')[0]}T${session.endTime}:00Z`).toISOString();
        
        return (
          <div key={session._id} className="session-item">
            <h4>{session.topicName}</h4>
            <button onClick={() => handleJoinSession(session.meetingLink)}>
              Join
            </button>
            <CountdownTimer startTime={startDateTime} endTime={endDateTime} recurrence="daily" />
          </div>
        );
      })
    ) : (
      <div className="no-sessions">
        <img 
          src="./Nodata.gif" 
          alt="No sessions found" 
          className="no-data-illustration"
        />
        <p>No sessions available.</p>
      </div>
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
  const [enrolledDataFetched, setEnrolledDataFetched] = useState(false);
  const [teachingDataFetched, setTeachingDataFetched] = useState(false);

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
      try {
        if (showEnrolled && !enrolledDataFetched && enrolledSessions?.length > 0) {
          setLoading(true);
          const response = await axios.post(`${API_URL}/student/sessions/details`, { sessionIds: enrolledSessions });
          console.log("Enrolled Sessions Data:", response.data);
          setSessionDetails(response.data);
          setEnrolledDataFetched(true);
        }
        if (showTeaching && !teachingDataFetched && teachingSessions?.length > 0) {
          setLoading(true);
          const response = await axios.post(`${API_URL}/student/sessions/details`, { sessionIds: teachingSessions });
          setTeachingSessionDetails(response.data);
          setTeachingDataFetched(true);
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [showEnrolled, showTeaching, enrolledSessions, teachingSessions, enrolledDataFetched, teachingDataFetched]);

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

  const toggleEnrolledSessions = () => {
    setShowEnrolled(!showEnrolled);
  };

  const toggleTeachingSessions = () => {
    setShowTeaching(!showTeaching);
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
          
          <button onClick={toggleEnrolledSessions}>
            {showEnrolled ? 'Hide Enrolled Sessions' : 'Show Enrolled Sessions'}
          </button>
          {showEnrolled && (
            <div className="enrolled-sessions">
              {loading ? <p>Loading...</p> : <SessionList sessions={sessionDetails} handleJoinSession={handleJoinSession} />}
            </div>
          )}

          <button onClick={toggleTeachingSessions}>
            {showTeaching ? 'Hide Teaching Sessions' : 'Show Teaching Sessions'}
          </button>
          {showTeaching && (
            <div className="teaching-sessions">
              {loading ? <p>Loading...</p> : <SessionList sessions={teachingSessionDetails} handleJoinSession={handleJoinSession} />}
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