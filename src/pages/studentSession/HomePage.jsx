import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../../redux/profileSlice';
import { API_URL } from '../../data/apiData';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import './HomePage.css';
import { FaSearch } from 'react-icons/fa';

const HomePage = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const profileImageFromStore = useSelector((state) => state.profile.profileImage);
  const usernameFromStore = useSelector((state) => state.profile.username);

  const topicOptions = [
    "All",
    "Java",
    "Python",
    "C++",
    "JavaScript",
    "Ruby",
    "PHP",
    "C#",
    "Go",
    "Swift",
    "Kotlin",
    "Others"
  ];

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
        if (!isInitialLoad) {
          setLoading(true);
        }
        const params = new URLSearchParams();
        if (searchQuery) params.append('searchTerm', searchQuery);
        if (selectedTopic) params.append('topicType', selectedTopic);

        const response = await axios.get(`${API_URL}/session/sessions?${params}`);
        console.log('Classes:', response.data);
        setClasses(response.data);
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchClasses();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTopic, isInitialLoad]);

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setShowOptions(false); // Close dropdown after selection
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBookSlot = async (sessionId) => {
    const token = localStorage.getItem('loginToken');
    
    // Get the session details from classes array
    const session = classes.find(cls => cls._id === sessionId);
    if (!session) {
        alert('Session not found');
        return;
    }

    // Check if session has already started
    const now = new Date();
    const sessionStartDate = new Date(session.startDate);
    const [hours, minutes] = session.startTime.split(':');
    sessionStartDate.setHours(parseInt(hours), parseInt(minutes), 0);

    if (now > sessionStartDate) {
        alert('Cannot enroll in a session that has already started');
        return;
    }

    try {
        const response = await axios.post(
            `${API_URL}/session/enroll/${sessionId}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (response.data.success) {
            alert(response.data.msg);
            window.location.reload();
        } else {
            alert(response.data.msg);
        }
    } catch (error) {
        console.error('Error enrolling in session:', error);
        const errorMessage = error.response?.data?.msg || 'Error enrolling in session';
        alert(errorMessage);
    }
};

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, ' - ');
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by topic name or instructor..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="home-select">
            <div
              className="home-selected"
              onClick={() => setShowOptions(!showOptions)}
              data-default="All"
            >
              {selectedTopic}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="home-arrow"
              >
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
              </svg>
            </div>
            {showOptions && (
              <div className="home-options">
                {topicOptions.map((topic) => (
                  <div key={topic} title={topic}>
                    <input
                      id={topic}
                      name="option"
                      type="radio"
                      value={topic}
                      checked={selectedTopic === topic}
                      onChange={handleTopicChange}
                    />
                    <label className="home-option" htmlFor={topic}>{topic}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>        
        {!selectedTopic && !searchQuery ? (
          <img src='./image.png' alt="Session" className="session-image" />
        ) : loading && !isInitialLoad ? (
          <div className="loading-container">
            <img src="./loading.gif" alt="Loading..." className="loading-gif" />
          </div>
        ) : classes.length === 0 ? (
          <div className="no-data-container">
            <img 
              src='./Nodata.gif' 
              alt="No sessions found"
            />
            <p>
              No sessions available {selectedTopic ? `for ${selectedTopic}` : ''} 
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </div>
        ) : (
          <div className="class-container">
            {classes.map((cls) => {
              // Check if session has started
              const now = new Date();
              const sessionStartDate = new Date(cls.startDate);
              const [hours, minutes] = cls.startTime.split(':');
              sessionStartDate.setHours(parseInt(hours), parseInt(minutes), 0);
              const hasStarted = now > sessionStartDate;
              
              // Check if session starts today
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const sessionDay = new Date(cls.startDate);
              sessionDay.setHours(0, 0, 0, 0);
              const isToday = sessionDay.getTime() === today.getTime();
            
              return (
                <div key={cls._id} className="class-card">
                  <div className="header">
                    <img 
                      src={cls.student.profileImage ? `${API_URL}/uploads/user_profiles/${cls.student.profileImage}` : './default.jpg'} 
                      alt={`${cls.student.username}'s profile`} 
                      className="profile-image"
                      onError={(e) => { e.target.onerror = null; e.target.src = './default.jpg'; }}
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
                          src={`${API_URL}/uploads/media/${cls.media}`} 
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
                      {isToday && !hasStarted && (
                        <span className="starts-today">Starts Today!</span>
                      )}
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
                    className={`book-slot-button ${
                      cls.availableSlots === 0 || hasStarted ? 'disabled' : 
                      isToday && !hasStarted ? 'starts-today' : ''
                    }`}
                    disabled={cls.availableSlots === 0 || hasStarted}
                    onClick={() => handleBookSlot(cls._id)}
                  >
                    {hasStarted ? 'Session Started' : 
                     cls.availableSlots === 0 ? 'No Slots Available' :
                     isToday ? 'Book Today\'s Session' : 'Book Slot'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;