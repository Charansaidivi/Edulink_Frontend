import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { API_URL } from '../data/apiData';
import './css/CreateClass.css'; // Import the CSS file

const CreateClass = () => {
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

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
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
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('loginToken');
            if (!token) {
                throw new Error('Not authenticated');
            }

            // Prepare the data to send using FormData
            const formDataToSend = new FormData();
            const { topicName, description, startDate, endDate, startTime, endTime, maxSlots, meetingLink, media, topicType } = formData;

            // Append data to FormData
            formDataToSend.append('topicName', topicName);
            formDataToSend.append('description', description);
            formDataToSend.append('startDate', new Date(startDate).toISOString());
            formDataToSend.append('endDate', new Date(endDate).toISOString());
            formDataToSend.append('startTime', startTime);
            formDataToSend.append('endTime', endTime);
            formDataToSend.append('maxSlots', Number(maxSlots));
            formDataToSend.append('meetingLink', meetingLink);
            formDataToSend.append('topicType', topicType);
            if (media) {
                formDataToSend.append('media', media); // Append the media file
            }

            // Fetch call for creating a class
            const response = await fetch(`${API_URL}/session/create-session`, {
                method: 'POST',
                headers: {
                    'token': token,
                },
                body: formDataToSend, // Use FormData as the body
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
              alert('Class created successfully!');
            } else {
                throw new Error(data.message || 'Error creating class');
            }
        } catch (error) {
            setError(error.message || 'Error creating class');
            alert(error.message || 'Error creating class');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <Navbar/>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6" id='newClass'>
            <div className="flex justify-center mb-6">
              <h2 className="text-2xl font-bold text-gray-600 text-center w-full">Create New Class</h2>
            </div>
    
            <form onSubmit={handleSubmit} className="space-y-6">    
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
                <label className="block text-sm font-medium text-gray-700">Upload Media</label>
                <input
                  type="file"
                  name="media"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
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