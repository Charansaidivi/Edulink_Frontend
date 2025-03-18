import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../redux/profileSlice'; 
import axios from 'axios';
import { API_URL } from '../data/apiData';
import Navbar from '../components/Navbar';
import CountdownTimer from '../components/CountdownTimer';
import { useNavigate } from 'react-router-dom';
import './css/ProfilePage.css';

const SessionList = ({ sessions, handleJoinSession, isTeaching, handleViewDetails }) => (
  <div className="session-list">
    {sessions.length > 0 ? (
      sessions.map((session) => {
        const startDateTime = new Date(`${session.startDate.split('T')[0]}T${session.startTime}:00Z`).toISOString();
        const endDateTime = new Date(`${session.endDate.split('T')[0]}T${session.endTime}:00Z`).toISOString();
        
        return (
          <div key={session._id} className="session-item">
            <div className="session-header">
              <h4>{session.topicName}</h4>
              <div className="session-actions">
                <div className="button-stack">
                  <button 
                    className="join-btn"
                    onClick={() => handleJoinSession(session.meetingLink)}
                  >
                    Join
                  </button>
                  {isTeaching && (
                    <span 
                      className="view-details-link"
                      onClick={() => handleViewDetails(session._id)}
                    >
                      View Details →
                    </span>
                  )}
                </div>
              </div>
            </div>
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
  const navigate = useNavigate();
  const { profileImage, username, email, enrolledSessions, teachingSessions } = useSelector((state) => state.profile);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [teachingSessionDetails, setTeachingSessionDetails] = useState([]);
  const [activeTab, setActiveTab] = useState('enrolled');
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
        if (activeTab === 'enrolled' && !enrolledDataFetched && enrolledSessions?.length > 0) {
          setLoading(true);
          const response = await axios.post(`${API_URL}/student/sessions/details`, { sessionIds: enrolledSessions });
          setSessionDetails(response.data);
          setEnrolledDataFetched(true);
        }
        if (activeTab === 'teaching' && !teachingDataFetched && teachingSessions?.length > 0) {
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
  }, [activeTab, enrolledSessions, teachingSessions, enrolledDataFetched, teachingDataFetched]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const token = localStorage.getItem('loginToken');
    if (file) {
      const formData = new FormData();
      formData.append('media', file);

      try {
        const response = await axios.post(
          `${API_URL}/student/upload/${userId}`, 
          formData, 
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
          }
        );
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

  const handleViewDetails = (sessionId) => {
    navigate(`/session-details/${sessionId}`);
  };

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-page">
          <div className="profile-container">
            <div className="profile-image-wrapper">
              <img 
                src={profileImage ? `${API_URL}/uploads/user_profiles/${profileImage}` : '/default.jpg'} 
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
          
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`} 
              onClick={() => setActiveTab('enrolled')}
            >
              Enrolled Sessions
            </button>
            <button 
              className={`tab-button ${activeTab === 'teaching' ? 'active' : ''}`} 
              onClick={() => setActiveTab('teaching')}
            >
              Teaching Sessions
            </button>
            <button 
              className={`tab-button ${activeTab === 'createdProjects' ? 'active' : ''}`} 
              onClick={() => setActiveTab('createdProjects')}
            >
              Created Projects
            </button>
            <button 
              className={`tab-button ${activeTab === 'enrolledProjects' ? 'active' : ''}`} 
              onClick={() => setActiveTab('enrolledProjects')}
            >
              Enrolled Projects
            </button>
          </div>

          {activeTab === 'enrolled' && (
            <div className="enrolled-sessions">
              {loading ? <p>Loading...</p> : <SessionList sessions={sessionDetails} handleJoinSession={handleJoinSession} isTeaching={false} />}
            </div>
          )}
          {activeTab === 'teaching' && (
            <div className="teaching-sessions">
              {loading ? <p>Loading...</p> : <SessionList sessions={teachingSessionDetails} handleJoinSession={handleJoinSession} isTeaching={true} handleViewDetails={handleViewDetails} />}
            </div>
          )}
          {activeTab === 'createdProjects' && (
            <div className="created-projects">
              {/* Replace with your Created Projects component or markup */}
              <p>No created projects found.</p>
            </div>
          )}
          {activeTab === 'enrolledProjects' && (
            <div className="enrolled-projects">
              {/* Replace with your Enrolled Projects component or markup */}
              <p>No enrolled projects found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ProfilePage;