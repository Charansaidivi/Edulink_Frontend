import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import './Project.css'; // Import the CSS file for Project

const Project = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState); // Toggle dropdown state
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-600 text-center mb-6">Project Discussion</h2>
                <div className="relative">
                    <button 
                        className="dropdown-button" 
                        onClick={toggleDropdown}
                    >
                        Select Role
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button 
                                className="dropdown-item" 
                                onClick={() => {
                                    navigate('/leader');
                                    setIsDropdownOpen(false);
                                }}
                            >
                                Leader
                            </button>
                            <button 
                                className="dropdown-item" 
                                onClick={() => {
                                    navigate('/member');
                                    setIsDropdownOpen(false);
                                }}
                            >
                                Member
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Project; 