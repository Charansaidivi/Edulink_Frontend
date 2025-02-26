import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../data/apiData';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Reset.css';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending request to:', `${API_URL}/student/request-password-reset`);
    
    try {
      const response = await axios.post(
        `${API_URL}/student/request-password-reset`, 
        { email: email },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Response:', response.data);
      setMessage(response.data.message || 'Password reset link sent successfully');
    } catch (error) {
      console.error('Request failed:', error);
      alert(error.response?.data?.message || 'Error requesting password reset');
      setMessage('');
    }
  };

  return (
    <section className="bg-white p-3 p-md-4 p-xl-5">
      <div className="container bg-white">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            <div className="card border-light-subtle shadow-sm">
              <div className="row g-0">
                <div className="col-12 col-md-6">
                  <img 
                    className="img-fluid rounded-start w-100 h-100 object-fit-cover" 
                    loading="lazy" 
                    src="./reset-password.gif" 
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
                            <h2 className="h4 text-center">Password Reset</h2>
                            <h3 className="fs-6 fw-normal text-secondary text-center m-0">
                              Provide the email address associated with your account to recover your password.
                            </h3>
                          </div>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="row gy-3 overflow-hidden">
                          <div className="col-12">
                            <div className="form-floating mb-3">
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                              <label htmlFor="email" className="form-label">Email</label>
                            </div>
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
                            <Link to="/login" className="link-secondary text-decoration-none">Login</Link>
                            <Link to="/register" className="link-secondary text-decoration-none">Register</Link>
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

export default RequestPasswordReset;