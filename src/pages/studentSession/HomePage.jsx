import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../../redux/profileSlice';
import { API_URL } from '../../data/apiData';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import './HomePage.css';
import { FaSearch, FaCog } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Import navigation hook

const HomePage = () => {
  const profile = useSelector((state) => state.profile);
  const [isPublic, setIsPublic] = useState(profile.isPublic);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigation hook

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
      console.log(userId);
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
        if (selectedTopic && selectedTopic !== 'All') params.append('topicType', selectedTopic);

        const response = await axios.get(`${API_URL}/session/sessions?${params}`);
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

  useEffect(() => {
    const checkGooglePreference = async () => {
        try {
            const token = localStorage.getItem('loginToken');
            const userId = localStorage.getItem('loginToken') 
                ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId 
                : "";

            if (!userId) {
                console.error('User ID not found in token');
                return;
            }

            const response = await axios.get(`${API_URL}/student/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { useGoogleCalendar } = response.data;

            // Store in Redux
            dispatch(setProfile({ useGoogleCalendar }));

            // Store in localStorage
            localStorage.setItem('useGoogleCalendar', JSON.stringify(useGoogleCalendar));

            // Show prompt if Google Calendar is not enabled
            if (!useGoogleCalendar) {
                setShowGooglePrompt(true);
            }
        } catch (error) {
            console.error('Error checking Google preference:', error);
        }
    };

    checkGooglePreference();
}, [dispatch]);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar openid email profile',
    onSuccess: async (response) => {
      try {
        const token = localStorage.getItem('loginToken');
        const serverResponse = await axios.post(`${API_URL}/student/google-auth`, {
          code: response.code,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (serverResponse.status === 200) {
          alert('Google Calendar integration enabled!');
          setShowGooglePrompt(false);
        }
      } catch (error) {
        console.error('Error enabling Google Calendar:', error);
        alert('Failed to enable Google Calendar. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      alert('Google login failed. Please try again.');
    },
  });

  const handleDecline = async () => {
    try {
      const token = localStorage.getItem('loginToken');
      await axios.put(`${API_URL}/student/update-preference`, {
        useGoogleCalendar: false,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowGooglePrompt(false);
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setShowOptions(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBookSlot = async (sessionId) => {
    const token = localStorage.getItem('loginToken');
    const session = classes.find(cls => cls._id === sessionId);
    
    if (!session) {
      alert('Session not found');
      return;
    }

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
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert(response.data.msg);
        window.location.reload();
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      console.error('Error enrolling in session:', error);
      alert(error.response?.data?.msg || 'Error enrolling in session');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, ' - ');
  };

  const toggleProfileVisibility = async () => {
    try {
      const token = localStorage.getItem('loginToken');
      const response = await axios.put(
        `${API_URL}/student/profile-visibility/${profile._id}`,
        { isPublic: !isPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsPublic(response.data.isPublic);
    } catch (error) {
      console.error("Error updating profile visibility:", error);
    }
  };

  const handleProfileClick = (ownerId) => {
    navigate(`/profile/${ownerId}`); // Navigate to the profile page of the owner
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
              {selectedTopic || 'All'}
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

        {loading ? (
          <div className="loading-container">
            <img src="./loading.gif" alt="Loading..." className="loading-gif" />
          </div>
        ) : classes.length === 0 ? (
          <div className="no-data-container">
            <img src="./Nodata.gif" alt="No sessions found" />
            <p>No sessions available</p>
          </div>
        ) : (
          <div className="class-container">
            {classes.map((cls) => (
              <div key={cls._id} className="class-card">
                <div className="session-header">
                  <div className="profile-container">
                    <img
                      src={cls.student.profileImage ? 
                        `${API_URL}/uploads/user_profiles/${cls.student.profileImage}` : 
                        './default.jpg'}
                      alt={`${cls.student.username}'s profile`}
                      className="profile-image"
                      onClick={() => handleProfileClick(cls.student._id)} // Pass the correct ownerId
                      style={{ cursor: 'pointer' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = './default.jpg'; }}
                    />
                  </div>
                  <div className="profile-details">
                    <span className="username">{cls.student.username}</span>
                  </div>
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
                  className="book-slot-button"
                  onClick={() => handleBookSlot(cls._id)}
                >
                  Book Slot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showGooglePrompt && (
        <div className="modal">
          <h2>Enable Google Calendar Integration</h2>
          <p>Would you like to sync your classes and enrollments with Google Calendar?</p>
          <button onClick={googleLogin}>Yes, Enable</button>
          <button onClick={handleDecline}>No, Thanks</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;