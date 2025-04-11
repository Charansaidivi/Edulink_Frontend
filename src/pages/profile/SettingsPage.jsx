import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../data/apiData';

const SettingsPage = () => {
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchProfileVisibility = async () => {
      const userId = localStorage.getItem('loginToken')
        ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId
        : '';
      try {
        const response = await axios.get(`${API_URL}/student/profile/${userId}`);
        setIsPublic(response.data.isPublic);
      } catch (error) {
        console.error('Error fetching profile visibility:', error);
      }
    };

    fetchProfileVisibility();
  }, []);

  const toggleVisibility = async () => {
    const userId = localStorage.getItem('loginToken')
      ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId
      : '';
    const token = localStorage.getItem('loginToken'); // Retrieve the token from local storage

    try {
      const response = await axios.put(
        `${API_URL}/student/profile-visibility/${userId}`,
        { isPublic: !isPublic },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      setIsPublic(response.data.isPublic);
      alert(`Profile visibility updated to ${response.data.isPublic ? 'Public' : 'Private'}`);
    } catch (error) {
      console.error('Error updating profile visibility:', error);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={toggleVisibility}
          />
          {isPublic ? 'Public Profile' : 'Private Profile'}
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;
