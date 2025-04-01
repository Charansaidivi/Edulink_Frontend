import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../data/apiData';
import Navbar from '../../components/Navbar';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const navigate = useNavigate();

  const isValidStudent = (student) => {
    return student && student.userId && typeof student.userId === 'object';
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    if (projectData) {
        setAcceptedCount(projectData.enrolledStudents.filter(s => s.status === 'accepted').length);
    }
  }, [projectData]);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem('loginToken');
      if (!token) {
        alert('Please login to continue');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/project/details/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProjectData(response.data);
      setEditedData(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again');
        localStorage.removeItem('loginToken');
        navigate('/login');
      } else {
        setError('Failed to fetch project details');
      }
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('loginToken');
        const response = await axios.put(
            `${API_URL}/project/update/${projectId}`, // Backend endpoint for updating the project
            editedData, // Send the updated project data
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token for authentication
                }
            }
        );
        setIsEditing(false);
        alert('Project updated successfully');
        fetchProjectDetails(); // Refresh the project details after the update
    } catch (err) {
        if (err.response?.status === 401) {
            alert('Session expired. Please login again');
            localStorage.removeItem('loginToken');
            navigate('/login');
        } else {
            setError('Failed to update project');
        }
    }
};

  const handleStatusUpdate = async (student, status) => {
    try {
        // Check team size before accepting
        if (status === 'accepted') {
            const currentAccepted = projectData.enrolledStudents.filter(
                s => s.status === 'accepted'
            ).length;
            
            if (currentAccepted >= projectData.teamSize) {
                alert(`Team is already full (Max: ${projectData.teamSize})`);
                return;
            }
        }

        // Get student ID and validate
        const studentId = student.userId._id;
        if (!studentId) {
            console.error('Invalid student data:', student);
            alert('Invalid student data');
            return;
        }

        // Make API call to update status
        const token = localStorage.getItem('loginToken');
        const response = await axios.put(
            `${API_URL}/project/student-status/${projectId}/${studentId}`,
            { status },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Update UI after successful status change
        if (response.data) {
            setProjectData(response.data.project);
            const newAcceptedCount = response.data.project.enrolledStudents.filter(
                s => s.status === 'accepted'
            ).length;
            setAcceptedCount(newAcceptedCount);
            alert(`Student ${status} successfully`);
            await fetchProjectDetails(); // Refresh data
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert(error.response?.data?.message || 'Failed to update status');
    }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="project-details-container">
        <div className="project-header">
          <h2>Project Details</h2>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              Edit Project
            </button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>Sector:</label>
              <input
                type="text"
                name="sector"
                value={editedData.sector}
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
              <label>Skills Required:</label>
              <input
                type="text"
                name="skillsRequired"
                value={editedData.skillsRequired.join(', ')}
                onChange={(e) => handleChange({ target: { name: 'skillsRequired', value: e.target.value.split(', ') } })}
                required
              />
            </div>
            <div className="form-group">
              <label>Team Size:</label>
              <input
                type="number"
                name="teamSize"
                value={editedData.teamSize}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Deadline:</label>
              <input
                type="date"
                name="deadline"
                value={editedData.deadline.split('T')[0]}
                onChange={handleChange}
                required
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
          <>
            <div className="project-info">
              <h3>{projectData?.sector}</h3>
              <p>{projectData?.description}</p>
              <p><strong>Skills Required:</strong> {projectData?.skillsRequired.join(', ')}</p>
              <p><strong>Team Size:</strong> {projectData?.teamSize}</p>
              <p><strong>Deadline:</strong> {new Date(projectData?.deadline).toLocaleDateString()}</p>
            </div>
            <div className="interested-students">
              <h3>Interested Students</h3>
              {projectData?.enrolledStudents?.length > 0 ? (
                // Update the students grid section with proper status checking
                <div className="students-grid">
                  {projectData.enrolledStudents.map((student) => (
                    <div key={student._id} className="student-card">
                      {/* Show status badge for all students */}
                      <div className={`status-badge ${student.status || 'pending'}`}>
                        {student.status || 'pending'}
                      </div>

                      {/* Student info */}
                      <img 
                        src={
                          student.userId?.profileImage 
                            ? `${API_URL}/uploads/user_profiles/${student.userId.profileImage}` 
                            : '/default.jpg'
                        } 
                        alt={student.userId?.username || 'Student'} 
                        className="student-image"
                        onError={(e) => {
                          e.target.src = '/default.jpg';
                        }}
                      />
                      <h4>{student.userId?.username || 'Anonymous Student'}</h4>
                      <p><strong>Email:</strong> {student.userId?.email || 'N/A'}</p>
                      <p><strong>Description:</strong> {student.description || 'No description provided'}</p>
                      
                      {/* LinkedIn link */}
                      {student.userId?.linkedIn && (
                        <a 
                          href={student.userId.linkedIn} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <i className="bx bxl-linkedin" style={{ fontSize: '24px', color: '#0077b5' }}></i>
                        </a>
                      )}

                      {/* Only show action buttons for pending students and when team is not full */}
                      {(!student.status || student.status === 'pending') && (
                        <div className="action-buttons">
                          <button 
                            className="accept-btn"
                            onClick={() => handleStatusUpdate(student, 'accepted')}
                            disabled={acceptedCount >= projectData.teamSize}
                            title={acceptedCount >= projectData.teamSize ? 'Team is full' : ''}
                          >
                            Accept
                          </button>
                          <button 
                            className="decline-btn"
                            onClick={() => handleStatusUpdate(student, 'declined')}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No students have expressed interest yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProjectDetails;