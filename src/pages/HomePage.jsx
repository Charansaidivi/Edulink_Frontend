import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_URL } from '../data/apiData';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const query = new URLSearchParams({
          searchTerm,
          topicType: selectedTopic
        }).toString();

        const response = await fetch(`${API_URL}/session/sessions?${query}`);
        const data = await response.json();
        console.log(data);
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [searchTerm, selectedTopic]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search for classes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <select
            value={selectedTopic}
            onChange={handleTopicChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Topics</option>
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
        <div>
          {classes.map((cls) => (
            <div key={cls._id} className="p-4 mb-4 border border-gray-300 rounded-md shadow-lg bg-white">
              <div className="profile-container">
                <img 
                  src={cls.student.profileImage ? `${API_URL}/uploads/${cls.student.profileImage}` : '/default.jpg'} 
                  alt={`${cls.student.username}'s profile`} 
                  className="profile-image" 
                />
                <p className="profile-name">{cls.student.username}</p>
              </div>
              <h3 className="text-xl font-bold">{cls.topicName}</h3>
              {cls.media && (
                <div className="my-2">
                  {cls.media.endsWith('.mp4') ? (
                    <video controls className="w-full">
                      <source src={`${API_URL}/uploads/${cls.media}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={`${API_URL}/uploads/${cls.media}`} alt="Session media" className="w-full" />
                  )}
                </div>
              )}
              <p>{cls.description}</p>
              <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Join Meeting</a>
              <button
                className={`mt-2 p-2 bg-blue-500 text-white rounded ${cls.availableSlots === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={cls.availableSlots === 0}
              >
                Book Slot
              </button>
              <p>Available Slots: {cls.availableSlots}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;