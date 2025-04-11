import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../data/apiData';
import Navbar from '../../components/Navbar';
import './OwnerProfilePage.css';

const OwnerProfilePage = () => {
  const { ownerId } = useParams(); // Get the ownerId from the URL
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/student/profile/${ownerId}`);
        setOwnerProfile(response.data);
      } catch (error) {
        console.error('Error fetching owner profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProfile();
  }, [ownerId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!ownerProfile) {
    return <p>Profile not found.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="owner-profile-container">
        <div className="owner-profile-header">
          <img
            src={ownerProfile.profileImage || './default.jpg'}
            alt="Profile"
            className="owner-profile-image"
          />
          <h2>{ownerProfile.username}</h2>
        </div>
        <p>Email: {ownerProfile.email}</p>
        <p>LinkedIn: {ownerProfile.linkedIn || 'Not provided'}</p>
        <div className="owner-profile-stats">
          <p>Created Classes: {ownerProfile.createdClassesCount}</p>
          <p>Enrolled Classes: {ownerProfile.enrolledClassesCount}</p>
          <p>Created Projects: {ownerProfile.createdProjectsCount}</p>
          <p>Enrolled Projects: {ownerProfile.enrolledProjectsCount}</p>
        </div>
      </div>
    </>
  );
};

export default OwnerProfilePage;