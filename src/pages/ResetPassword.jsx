import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../data/apiData';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './Reset.css';

const ResetPassword = () => {
  const { token, email } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
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
      alert(error.response?.data?.message || 'Error resetting password');
      setMessage('');
    }
  };

  return (
    <section className="bg-white p-3 p-md-4 p-xl-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            <div className="card border-light-subtle shadow-sm">
              <div className="row g-0">
                <div className="col-12 col-md-6">
                  <img 
                    className="img-fluid rounded-start w-100 h-100 object-fit-cover" 
                    loading="lazy" 
                    src="/conform-password.gif" 
                    alt="Reset Password"
                  />
                </div>
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <div className="col-12 col-lg-11 col-xl-10">
                    <div className="card-body p-3 p-md-4 p-xl-5">
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-5">
                            <div className="text-center mb-4">
                              <img src="./logo.png" alt="EduLink Logo" width="175" height="57" />
                            </div>
                            <h2 className="h4 text-center">Reset Your Password</h2>
                            <h3 className="fs-6 fw-normal text-secondary text-center m-0">
                              Enter your new password below
                            </h3>
                          </div>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="row gy-3 overflow-hidden">
                          <div className="col-12">
                            <div className="form-floating mb-3">
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                              />
                              <label htmlFor="password" className="form-label">New Password</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-floating mb-3">
                              <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                              />
                              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            </div>
                            {passwordError && (
                              <div className="text-danger small mb-3">
                                {passwordError}
                              </div>
                            )}
                          </div>
                          <div className="col-12">
                            <div className="d-grid">
                              <button className="btn btn-dark btn-lg" type="submit">
                                Reset Password
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                      {message && (
                        <div className="alert alert-info mt-3" role="alert">
                          {message}
                        </div>
                      )}
                      <div className="row">
                        <div className="col-12">
                          <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center mt-5">
                            <Link to="/" className="link-secondary text-decoration-none">Back to Login</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
