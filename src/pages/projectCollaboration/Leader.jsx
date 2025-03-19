import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios'; // Import axios
import './Leader.css'; // Import the CSS file for Leader

const Leader = () => {
    const [formData, setFormData] = useState({
        sector: '',
        skillsRequired: '',
        teamSize: '',
        deadline: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Prepare the data to send using FormData
            const dataToSend = {
                sector: formData.sector,
                skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim()), // Convert to array and trim whitespace
                teamSize: Number(formData.teamSize), // Ensure teamSize is a number
                deadline: new Date(formData.deadline), // Ensure deadline is a Date object
                description: formData.description
            };

            console.log('Form Data:', dataToSend); // Log form data

            // Send the form data to the backend
            const response = await axios.post('http://localhost:4005/project/create-projects', dataToSend, {
                headers: {
                    'Content-Type': 'application/json' // Set content type to JSON
                }
            });

            console.log('Project created successfully:', response.data);
            // Optionally, you can reset the form or redirect the user
            setFormData({
                sector: '',
                skillsRequired: '',
                teamSize: '',
                deadline: '',
                description: ''
            });
        } catch (error) {
            console.error('Error creating project:', error);
            console.error('Error response:', error.response.data); // Log error response
            setError('Error creating project. Please try again.'); // Set error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-600 text-center mb-6">Create New Project</h2>
                {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Sector</label>
                        <input
                            type="text"
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Skills Required (comma separated)</label>
                        <input
                            type="text"
                            name="skillsRequired"
                            value={formData.skillsRequired}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="e.g., JavaScript, React, Node.js"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Team Size</label>
                        <input
                            type="number"
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            required
                            min="1"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Leader;