import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../redux/profileSlice';
import { API_URL } from '../data/apiData';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './HomePage.css';
import SessionImage from '/Session.png'; // Update the path to your image

const HomePage = () => {
  const dispatch = useDispatch();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [classes, setClasses] = useState([]);
  const profileImageFromStore = useSelector((state) => state.profile.profileImage);
  const usernameFromStore = useSelector((state) => state.profile.username);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('loginToken') ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId : "";
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
  }, [dispatch]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const query = new URLSearchParams({
          topicType: selectedTopic
        }).toString();
        const response = await fetch(`${API_URL}/session/sessions?${query}`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    if (selectedTopic) {
      fetchClasses();
    }
  }, [selectedTopic]);

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleBookSlot = async (sessionId) => {
    const token = localStorage.getItem('loginToken');
    try {
      const response = await fetch(`${API_URL}/session/enroll/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token // Assuming you use JWT for authentication
        }
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.msg);
        window.location.reload();
      } else {
        alert(data.msg); // Show error message
      }
    } catch (error) {
      console.error('Error enrolling in session:', error);
      alert('Error enrolling in session');
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, ' - ');
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <select
            value={selectedTopic}
            onChange={handleTopicChange}
            className="topic-select"
            style={{ marginTop: '20px', zIndex: 10 }}
          >
            <option value="">Choose Topic</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="C++">C++</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Ruby">Ruby</option>
            <option value="PHP">PHP</option>
            <option value="C#">C#</option>
            <option value="Go">Go</option>
            <option value="Swift">Swift</option>
            <option value="Kotlin">Kotlin</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="class-container">
          {classes.map((cls) => (
            <div key={cls._id} className="class-card">
              <div className="header">
                <img 
                  src={cls.student.profileImage ? `${API_URL}/uploads/${cls.student.profileImage}` : '/default.jpg'} 
                  alt={`${cls.student.username}'s profile`} 
                  className="profile-image"
                />
                <span className="username">{cls.student.username}</span>
              </div>
              <h3 className="topic-name">{cls.topicName}</h3>
              <hr />
              {cls.media && (
                <div className="media-container">
                  {cls.media.endsWith('.mp4') || cls.media.endsWith('.mov') ? (
                    <video 
                      src={`${API_URL}/uploads/${cls.media}`} 
                      alt="Uploaded Media" 
                      className="media-video" 
                      controls
                    />
                  ) : (
                    <img 
                      src={`${API_URL}/uploads/${cls.media}`} 
                      alt="Uploaded Media" 
                      className="media-image"
                    />
                  )}
                </div>
              )}
              <div className="details">
                <div className="date-time">
                  <span>Start Date: {formatDate(cls.startDate)}</span>
                  <span>Start Time: {cls.startTime}</span>
                </div>
                <div className="date-time">
                  <span>End Date: {formatDate(cls.endDate)}</span>
                  <span>End Time: {cls.endTime}</span>
                </div>
                <div className="slots">
                  <span>Total Slots: {cls.maxSlots}</span>
                  <span>Available Slots: {cls.availableSlots}</span>
                </div>
              </div>
              <button
                className={`book-slot-button ${cls.availableSlots === 0 ? 'disabled' : ''}`}
                disabled={cls.availableSlots === 0}
                onClick={() => handleBookSlot(cls._id)}
              >
                Book Slot
              </button>
            </div>
          ))}
        </div>
        <button className="choose-topic-button">Choose Topic</button>
        <img src={SessionImage} alt="Session" className="session-image" />
      </div>
    </div>
  );
};

export default HomePage;