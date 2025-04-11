import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../data/apiData';
import Navbar from '../../components/Navbar';
import './Member.css';

const Member = () => {
  const [projects, setProjects] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalProject, setModalProject] = useState(null);
  const [interestDesc, setInterestDesc] = useState('');
  const [inputLinkedIn, setInputLinkedIn] = useState('');

  const profile = useSelector((state) => state.profile);

  const userId = localStorage.getItem('loginToken')
    ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId
    : "";

  const token = localStorage.getItem('loginToken');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/project/projects`;
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('searchTerm', searchQuery);
        }
        if (selectedSector !== 'All') {
          params.append('sector', selectedSector);
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [searchQuery, selectedSector]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await axios.get(`${API_URL}/project/sectors`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAvailableSectors(['All', ...response.data]);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };
    fetchSectors();
  }, [projects]);

  const handleInterestClick = (project) => {
    setModalProject(project);
    setShowModal(true);
    setInterestDesc('');
    setInputLinkedIn('');
  };

  const handleSubmitInterest = async () => {
    const finalLinkedIn = profile.linkedIn || inputLinkedIn;
    try {
      await axios.post(`${API_URL}/project/interest/${modalProject._id}`, {
        userId,
        description: interestDesc,
        linkedIn: finalLinkedIn
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Interest submitted successfully");
      setShowModal(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Error submitting interest:", error);
        alert("Error submitting interest");
      }
    }
  };

  return (
    <div className="member-container">
      <Navbar />
      <div className="profile-section">
        <img
          src={profile.profileImage || './default.jpg'}
          alt="Profile"
          className="profile-image"
        />
        <h2>{profile.username}</h2>
        <p>Email: {profile.email}</p>
        <p>LinkedIn: {profile.linkedIn || 'Not provided'}</p>
        <div className="profile-stats">
          <p>Created Projects: {profile.createdProjectsCount}</p>
          <p>Enrolled Projects: {profile.enrolledProjectsCount}</p>
          <p>Created Sessions: {profile.createdSessionsCount}</p>
          <p>Enrolled Sessions: {profile.enrolledSessionsCount}</p>
        </div>
      </div>
      <div className="project-wrapper">
        <h2 className="header-title">Projects</h2>
        
        <div className="member-project-filter">
          <div className="member-search-container">
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="member-search-input"
            />
          </div>
          <div className="member-select">
            <div 
              className="member-selected" 
              onClick={() => setShowOptions(!showOptions)}
            >
              {selectedSector}
              <span>▾</span>
            </div>
            {showOptions && (
              <div className="member-options">
                {availableSectors.map((sector) => (
                  <div 
                    key={sector} 
                    onClick={() => { 
                      setSelectedSector(sector);
                      setShowOptions(false);
                    }}
                  >
                    {sector}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="project-cards">
          {loading ? (
            <p>Loading...</p>
          ) : projects.length === 0 ? (
            <div className="no-data-container">
              <img 
                src="/Nodata.gif" 
                alt="No projects found" 
                className="no-data-illustration" 
              />
              <p>
                No active projects available
                {selectedSector !== 'All' ? ` in ${selectedSector}` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div 
                key={project._id} 
                className={`project-card ${project.isDeadlineSoon ? 'deadline-soon' : ''}`}
              >
                <div className="project-header">
                  <h3>{project.sector}</h3>
                  <div className="deadline-info">
                    <span className={`days-left ${project.isDeadlineSoon ? 'urgent' : ''}`}>
                      {project.daysLeft} days left
                    </span>
                  </div>
                </div>
                <p>{project.description}</p>
                <p><strong>Skills Required:</strong> {project.skillsRequired.join(', ')}</p>
                <p><strong>Team Size:</strong> {project.teamSize}</p>
                <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                <button 
                  onClick={() => handleInterestClick(project)}
                  className={project.isDeadlineSoon ? 'urgent-btn' : ''}
                >
                  I'm Interested
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Express Your Interest</h3>
            <p>Why are you interested in this project?</p>
            <textarea
              value={interestDesc}
              onChange={(e) => setInterestDesc(e.target.value)}
              placeholder="Enter your description..."
            />
            { !profile.linkedIn && (
              <>
                <p>Please provide your LinkedIn URL:</p>
                <input 
                  type="text" 
                  value={inputLinkedIn}
                  onChange={(e) => setInputLinkedIn(e.target.value)}
                  placeholder="https://www.linkedin.com/..."
                />
              </>
            )}
            <div className="modal-buttons">
              <button onClick={handleSubmitInterest}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;