import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../data/apiData';

const ResetPassword = () => {
  const { token, email } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting reset password request:', { token, newPassword, email });
    try {
      const response = await axios.post(`${API_URL}/student/reset-password`, { 
        token, 
        newPassword,
        email: decodeURIComponent(email)
      });
      console.log('Response:', response);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage(error.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
