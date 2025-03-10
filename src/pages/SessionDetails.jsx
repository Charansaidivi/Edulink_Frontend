import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../data/apiData';
import Navbar from '../components/Navbar';
import './css/SessionDetails.css';

const SessionDetails = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [newMedia, setNewMedia] = useState(null);
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isSessionStarted = () => {
    if (!sessionData) return false;
    
    const now = new Date();
    const sessionStartDate = sessionData.startDate.split('T')[0];
    const [hours, minutes] = sessionData.startTime.split(':');
    
    const sessionStart = new Date(sessionStartDate);
    sessionStart.setHours(parseInt(hours), parseInt(minutes), 0);
    
    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get session date without time
    const sessionDate = new Date(sessionStartDate);
    sessionDate.setHours(0, 0, 0, 0);
    
    // If session date is today, check time
    if (sessionDate.getTime() === today.getTime()) {
      return now >= sessionStart;
    }
    
    // If session date is in the past, consider it started
    return sessionDate < today;
  };

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      const token = localStorage.getItem('loginToken');
      if (!token) {
        alert('Please login to continue');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/student/session/${sessionId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSessionData(response.data);
      setEditedData(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again');
        localStorage.removeItem('loginToken');
        navigate('/login');
      } else {
        setError('Failed to fetch session details');
      }
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Create a new Date object for the selected date
    if (name === 'startDate' || name === 'startTime') {
      const selectedDate = new Date(name === 'startDate' ? value : editedData.startDate);
      if (name === 'startTime') {
        const [hours, minutes] = value.split(':');
        selectedDate.setHours(parseInt(hours), parseInt(minutes), 0);
      }
      
      // Check if the session has already started
      const now = new Date();
      if (selectedDate <= now) {
        alert('Cannot modify start date/time for an ongoing or completed session');
        return;
      }
    }

    // Date and Time validations
    if (name === 'startDate') {
      const today = getCurrentDate();
      if (value < today) {
        alert('Start date cannot be in the past');
        return;
      }
    }

    if (name === 'endDate' && editedData.startDate) {
      if (value < editedData.startDate) {
        alert('End date cannot be before start date');
        return;
      }
    }

    if (name === 'startTime' && editedData.startDate === getCurrentDate()) {
      const currentTime = getCurrentTime();
      if (value < currentTime) {
        alert('Start time cannot be in the past');
        return;
      }
    }

    if (name === 'endTime') {
      if (editedData.startDate === editedData.endDate && value <= editedData.startTime) {
        alert('End time must be later than start time');
        return;
      }
    }

    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (e) => {
    setNewMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('loginToken');
      const formData = new FormData();
      Object.keys(editedData).forEach(key => {
        if (key !== 'media' && key !== 'enrolledStudents') {
          formData.append(key, editedData[key]);
        }
      });
      if (newMedia) {
        formData.append('media', newMedia);
      }

      const response = await axios.put(
        `${API_URL}/student/session/${sessionId}/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if(response.ok){
        setIsEditing(false);
        alert('Session updated successfully');
      }
      setIsEditing(false);
      fetchSessionDetails();
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again');
        localStorage.removeItem('loginToken');
        navigate('/login');
      } else {
        setError('Failed to update session');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="session-details-container">
        <div className="session-header">
          <h2>Session Details</h2>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              Edit Session
            </button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>Topic Name:</label>
              <input
                type="text"
                name="topicName"
                value={editedData.topicName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={editedData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={editedData.startDate.split('T')[0]}
                onChange={handleChange}
                min={getCurrentDate()}
                disabled={isSessionStarted()}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={editedData.endDate.split('T')[0]}
                onChange={handleChange}
                min={editedData.startDate.split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={editedData.startTime}
                onChange={handleChange}
                min={editedData.startDate === getCurrentDate() ? getCurrentTime() : undefined}
                disabled={isSessionStarted()}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time:</label>
              <input
                type="time"
                name="endTime"
                value={editedData.endTime}
                onChange={handleChange}
                min={editedData.startTime}
                required
              />
            </div>
            <div className="form-group">
              <label>Update Media:</label>
              <input
                type="file"
                onChange={handleMediaChange}
                accept="image/*,video/*"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // Existing view mode JSX
          <>
            <div className="session-info">
              <h3>{sessionData?.topicName}</h3>
              <p>{sessionData?.description}</p>
              {sessionData?.media && (
                <div className="session-media">
                  {sessionData.topicType === 'video' ? (
                    <video 
                      src={`${API_URL}/uploads/${sessionData.media}`}
                      controls
                      className="session-video"
                    />
                  ) : (
                    <img 
                      src={`${API_URL}/uploads/media/${sessionData.media}`}
                      alt="Session material"
                      className="session-image"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="enrolled-students">
              <h3>Enrolled Students</h3>
              {sessionData?.enrolledStudents?.length > 0 ? (
                <div className="students-grid">
                  {sessionData.enrolledStudents.map((student) => (
                    <div key={student._id} className="student-card">
                      <img 
                        src={student.profileImage ? `${API_URL}/uploads/${student.profileImage}` : '/default.jpg'} 
                        alt={student.username}
                        className="student-image"
                      />
                      <h4>{student.username}</h4>
                      <p>{student.email}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No students enrolled yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SessionDetails;