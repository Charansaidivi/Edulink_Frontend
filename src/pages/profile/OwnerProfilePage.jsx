import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../data/apiData';
import Navbar from '../../components/Navbar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
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
          <div className="profile-image-wrapper">
            <img
              src={ownerProfile.profileImage || './default.jpg'}
              alt="Profile"
              className="owner-profile-image"
            />
          </div>
          <div className="profile-details">
            <h2>{ownerProfile.username}</h2>
            <p>Email: {ownerProfile.email}</p>
            <p>
              <i className="bx bxl-linkedin linkedin-icon"></i>
              {ownerProfile.linkedIn ? (
                <a href={ownerProfile.linkedIn} target="_blank" rel="noopener noreferrer">
                  LinkedIn Profile
                </a>
              ) : (
                'Not provided'
              )}
            </p>
          </div>
        </div>

        <div className="owner-profile-stats">
          <div className="stat-item">
            <CircularProgressbar
              value={ownerProfile.createdClassesCount || 0}
              text={`${ownerProfile.createdClassesCount || 0}`}
              styles={buildStyles({
                textColor: '#007bff',
                pathColor: '#007bff',
                trailColor: '#d6d6d6',
              })}
            />
            <p>Created Classes</p>
          </div>
          <div className="stat-item">
            <CircularProgressbar
              value={ownerProfile.enrolledClassesCount || 0}
              text={`${ownerProfile.enrolledClassesCount || 0}`}
              styles={buildStyles({
                textColor: '#28a745',
                pathColor: '#28a745',
                trailColor: '#d6d6d6',
              })}
            />
            <p>Enrolled Classes</p>
          </div>
          <div className="stat-item">
            <CircularProgressbar
              value={ownerProfile.createdProjectsCount || 0}
              text={`${ownerProfile.createdProjectsCount || 0}`}
              styles={buildStyles({
                textColor: '#ffc107',
                pathColor: '#ffc107',
                trailColor: '#d6d6d6',
              })}
            />
            <p>Created Projects</p>
          </div>
          <div className="stat-item">
            <CircularProgressbar
              value={ownerProfile.enrolledProjectsCount || 0}
              text={`${ownerProfile.enrolledProjectsCount || 0}`}
              styles={buildStyles({
                textColor: '#dc3545',
                pathColor: '#dc3545',
                trailColor: '#d6d6d6',
              })}
            />
            <p>Enrolled Projects</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerProfilePage;