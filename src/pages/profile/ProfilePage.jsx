import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../../redux/profileSlice'; 
import axios from 'axios';
import { API_URL } from '../../data/apiData';
import Navbar from '../../components/Navbar';
import CountdownTimer from '../../components/CountdownTimer';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

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
  const { profileImage, username, email, linkedIn, enrolledSessions, teachingSessions } = useSelector((state) => state.profile);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [teachingSessionDetails, setTeachingSessionDetails] = useState([]);
  const [activeTab, setActiveTab] = useState('enrolled');
  const [loading, setLoading] = useState(false);
  const [enrolledDataFetched, setEnrolledDataFetched] = useState(false);
  const [teachingDataFetched, setTeachingDataFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedLinkedIn, setEditedLinkedIn] = useState(linkedIn);

  const userId = localStorage.getItem('loginToken') 
    ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId 
    : "";

  useEffect(() => {
    if (username) {
      setEditedUsername(username);
    }
    if (linkedIn) {
      setEditedLinkedIn(linkedIn);
    }
  }, [username, linkedIn]);

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

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('loginToken');
    
    // Only update fields that have changed; unchanged fields will be undefined.
    const payload = {
      username: editedUsername !== username ? editedUsername : undefined,
      linkedIn: editedLinkedIn !== linkedIn ? editedLinkedIn : undefined,
    };
    
    // Optionally, if nothing changed, you can decide not to call the API:
    if (payload.username === undefined && payload.linkedIn === undefined) {
      alert("No changes to update");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/student/profile/update/${userId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // Update the redux profile with new details returned by the API
      dispatch(setProfile({ 
        username: response.data.username,
        linkedIn: response.data.linkedIn
      }));
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-page">
          <div className="profile-container" style={{ position: 'relative' }}>
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
            <div className="profile-info">
              {isEditing ? (
                <>
                  <input 
                    type="text" 
                    value={editedUsername} 
                    onChange={(e) => setEditedUsername(e.target.value)} 
                    className="edit-input"
                  />
                  <p>
                    <i className="bx bx-envelope" style={{ marginRight: '5px' }}></i>
                    {email}
                  </p>
                  <p>
                    <i 
                      className="bx bxl-linkedin" 
                      style={{ marginRight: '5px', color: '#0077b5', fontSize: '20px' }}
                    ></i>
                    <input 
                      type="text" 
                      value={editedLinkedIn || ''} 
                      onChange={(e) => setEditedLinkedIn(e.target.value)} 
                      placeholder="Add LinkedIn URL"
                      className="edit-input"
                    />
                  </p>
                  <button onClick={handleSaveProfile} className="save-btn">Save</button>
                </>
              ) : (
                <>
                  <h2>{username}</h2>
                  <p>
                    <i className="bx bx-envelope" style={{ marginRight: '5px' }}></i>
                    {email}
                  </p>
                  <p>
                    <i 
                      className="bx bxl-linkedin" 
                      style={{ marginRight: '5px', color: '#0077b5', fontSize: '20px' }}
                    ></i>
                    {linkedIn ? (
                      <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                        {linkedIn}
                      </a>
                    ) : (
                      <span className="add-linkedIn">Add LinkedIn URL</span>
                    )}
                  </p>
                </>
              )}
            </div>
            <div 
              className="profile-edit-icon" 
              onClick={() => setIsEditing(!isEditing)}
              title="Edit Profile"
            >
              <i className='bx bx-edit'></i>
            </div>
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
              <p>No created projects found.</p>
            </div>
          )}
          {activeTab === 'enrolledProjects' && (
            <div className="enrolled-projects">
              <p>No enrolled projects found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;