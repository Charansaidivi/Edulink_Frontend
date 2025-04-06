import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { API_URL } from '../../data/apiData';
import './CreateClass.css'; // Import the CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { useGoogleLogin } from '@react-oauth/google'; // Import useGoogleLogin
import { setProfile } from '../../redux/ProfileSlice';

const CreateClass = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
      topicName: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      maxSlots: '',
      meetingLink: '',
      media: null,
      topicType:''
    });

    // Add this state for file name display
    const [fileName, setFileName] = useState('Upload a file');

    // Access useGoogleCalendar from Redux store
    const useGoogleCalendar = useSelector((state) => state.profile.useGoogleCalendar);
    const dispatch = useDispatch();

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleTimeValidation = (e) => {
        const { name, value } = e.target;
        const today = new Date().toISOString().split('T')[0];
        
        if (formData.startDate === today && name === 'startTime') {
            const currentTime = getCurrentTime();
            if (value < currentTime) {
                alert('Please select a time later than current time');
                return;
            }
        }

        if (name === 'endTime' && formData.startDate === formData.endDate) {
            if (value <= formData.startTime) {
                alert('End time must be later than start time');
                return;
            }
        }

        handleChange(e);
    };

    // Update the handleChange function to validate file types
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            if (file) {
                // Check file type
                const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
                const validTypes = [...validImageTypes, ...validVideoTypes];

                if (!validTypes.includes(file.type)) {
                    alert('Please upload only image or video files');
                    e.target.value = ''; // Reset file input
                    return;
                }

                // Check file size (e.g., 50MB limit)
                const maxSize = 50 * 1024 * 1024; // 50MB in bytes
                if (file.size > maxSize) {
                    alert('File size should be less than 50MB');
                    e.target.value = ''; // Reset file input
                    return;
                }

                setFileName(file.name);
                setFormData(prevState => ({
                    ...prevState,
                    media: file
                }));
            }
        } else {
            // Time and Date Validations
            if (name === 'startTime' && formData.startDate === new Date().toISOString().split('T')[0]) {
                const currentTime = getCurrentTime();
                if (value < currentTime) {
                    alert('Please select a time later than current time');
                    return;
                }
            }

            if (name === 'endTime' && formData.startDate === formData.endDate) {
                if (value <= formData.startTime) {
                    alert('End time must be later than start time');
                    return;
                }
            }

            // End date validation
            if (name === 'endDate' && formData.startDate && value < formData.startDate) {
                alert('End date cannot be before start date');
                return;
            }

            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Define the googleLogin function
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        scope: 'https://www.googleapis.com/auth/calendar openid email profile',
        onSuccess: async (response) => {
            try {
                const token = localStorage.getItem('loginToken');
                const serverResponse = await axios.post(`${API_URL}/student/enable-google-calendar`, {
                    code: response.code,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (serverResponse.status === 200) {
                    alert('Google Calendar integration enabled!');
                    dispatch(setProfile({ useGoogleCalendar: true })); // Update Redux store
                    localStorage.setItem('useGoogleCalendar', true); // Persist in localStorage
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('loginToken');
            if (!token) {
                alert('Please login to continue');
                navigate('/login');
                return;
            }

            // Check useGoogleCalendar from Redux store
            console.log(useGoogleCalendar)
            if (!useGoogleCalendar) {
                const enableGoogle = window.confirm('Would you like to enable Google Calendar integration?');
                if (enableGoogle) {
                    await googleLogin();
                }
            }

            // Prepare the data to send using FormData
            const formDataToSend = new FormData();
            const { topicName, description, startDate, endDate, startTime, 
                    endTime, maxSlots, meetingLink, media, topicType } = formData;

            // Append data to FormData
            formDataToSend.append('topicName', topicName);
            formDataToSend.append('description', description);
            formDataToSend.append('startDate', startDate); // Send as YYYY-MM-DD
            formDataToSend.append('endDate', endDate);     // Send as YYYY-MM-DD
            formDataToSend.append('startTime', startTime);
            formDataToSend.append('endTime', endTime);
            formDataToSend.append('maxSlots', Number(maxSlots));
            formDataToSend.append('meetingLink', meetingLink);
            formDataToSend.append('topicType', topicType);
            if (media) {
                formDataToSend.append('media', media);
            }

            // Axios call with Bearer token
            const response = await axios.post(
                `${API_URL}/session/create-session`, 
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert('Class created successfully!');
            // Clear form data
            setFormData({
                topicName: '',
                description: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                maxSlots: '',
                meetingLink: '',
                media: null,
                topicType: ''
            });
            setFileName('Upload a file');
            navigate('/home');
        } catch (error) {
            if (error.response?.status === 401) {
                const errorMsg = error.response?.data?.msg || 'Session expired. Please login again';
                alert(errorMsg);
                localStorage.removeItem('loginToken');
                navigate('/login');
                return;
            }
            
            const errorMessage = error.response?.data?.message || 'Error creating class';
            console.log(error)
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <Navbar/>
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="form">
              <span className="text-2xl">Create New Class</span>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Topic Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Topic Name</label>
                    <input
                      type="text"
                      name="topicName"
                      value={formData.topicName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>

                  {/* Topic Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Topic Type</label>
                    <select
                      name="topicType"
                      value={formData.topicType}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    >
                      <option value="">Select a topic</option>
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

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      min={getCurrentDate()}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate || getCurrentDate()}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleTimeValidation}
                      min={formData.startDate === getCurrentDate() ? getCurrentTime() : undefined}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleTimeValidation}
                      min={formData.startTime}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>

                  {/* Max Slots */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Maximum Slots</label>
                    <input
                      type="number"
                      name="maxSlots"
                      value={formData.maxSlots}
                      onChange={handleChange}
                      required
                      min="1"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Meeting Link */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      placeholder="https://meet.google.com/..."
                    />
                  </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  ></textarea>
                </div>

                {/* Media File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Media (Images or Videos only)
                    </label>
                    <label className="file-upload" htmlFor="file-input">
                        <span className="file-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 71 67">
                                <path
                                    strokeWidth="5"
                                    stroke="black"
                                    d="M41.7322 11.7678L42.4645 12.5H43.5H68.5V64.5H2.5V2.5H32.4645L41.7322 11.7678Z"
                                />
                            </svg>
                            <span className="file-front"></span>
                        </span>
                        <input
                            id="file-input"
                            type="file"
                            name="media"
                            onChange={handleChange}
                            className="file-input"
                            accept="image/*,video/*"
                        />
                        <span className="file-name">
                            {fileName} 
                            {formData.media && (
                                <span className="file-size">
                                    ({(formData.media.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                            )}
                        </span>
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                        Supported formats: JPG, PNG, GIF, WEBP, MP4, WEBM, OGG (Max 50MB)
                    </p>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="btn btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
    );
};

export default CreateClass;