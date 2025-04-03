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
  // New state for modal
  const [showModal, setShowModal] = useState(false);
  const [modalProject, setModalProject] = useState(null);
  const [interestDesc, setInterestDesc] = useState('');
  const [inputLinkedIn, setInputLinkedIn] = useState('');

  // Extract linkedIn from Redux store
  const { linkedIn } = useSelector((state) => state.profile);

  // Extract userId from localStorage
  const userId = localStorage.getItem('loginToken')
    ? JSON.parse(atob(localStorage.getItem('loginToken').split('.')[1])).userId
    : "";

  // Extract the token from localStorage
  const token = localStorage.getItem('loginToken');

  // Fetch projects based on search and selected sector filter
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
            Authorization: `Bearer ${token}` // Include the token
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

  // Fetch available sectors for the drop down
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await axios.get(`${API_URL}/project/sectors`, {
          headers: {
            Authorization: `Bearer ${token}` // Include the token
          }
        });
        // Add "All" as default option
        setAvailableSectors(['All', ...response.data]);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };
    fetchSectors();
  }, [projects]);

  // Handle interest button click – show modal and set project details
  const handleInterestClick = (project) => {
    setModalProject(project);
    setShowModal(true);
    setInterestDesc(''); // reset description
    setInputLinkedIn(''); // reset linkedIn input
  };

  // Handle modal submit: submit data to backend and store interest info in database.
  const handleSubmitInterest = async () => {
    // Use inputLinkedIn if linkedIn is null/empty, otherwise use the existing one from profile.
    const finalLinkedIn = linkedIn || inputLinkedIn;
    try {
      await axios.post(`${API_URL}/project/interest/${modalProject._id}`, {
        userId,
        description: interestDesc,
        linkedIn: finalLinkedIn
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token
        }
      });
      alert("Interest submitted successfully");
      setShowModal(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Display the error message from the backend
      } else {
        console.error("Error submitting interest:", error);
        alert("Error submitting interest");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Navbar />
      <div className="project-wrapper">
        <h2 className="header-title">Projects</h2>
        
        {/* Filters */}
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
        
        {/* Project Cards */}
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

      {/* Modal overlay */}
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
            { !linkedIn && (
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