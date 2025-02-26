import React, { useState } from 'react';
import { API_URL } from '../data/apiData';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
const Register = () => {
  const navigate = useNavigate();
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/student/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setEmail('');
        setName('');
        setPassword('');
        alert('Student registered successfully');
        LoginHandler();
      }
    } catch (error) {
      console.log('registration failed', error);
      alert('Registration failed');
    }
  };

  const handleGoogleSignupSuccess = async (response) => {
    console.log('Google signup success:', response);
    const { credential } = response;

    try {
      const serverResponse = await fetch(`${API_URL}/student/google-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });

      const data = await serverResponse.json();
      if (serverResponse.ok) {
        console.log('Server response:', data);
        alert('Signup successful');
        navigate('/home');
      } else {
        console.error('Server error:', data);
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Signup failed');
    }
  };

  const handleGoogleSignupFailure = (error) => {
    console.error('Google signup failed:', error);
    alert('Google signup failed');
  };
  const LoginHandler = () => {
    navigate('/login');
  }

  return (
    <section className="bg-white p-3 p-md-4 p-xl-5">
      <div className="container bg-white">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-10">
            <div className="card border-light-subtle shadow-sm">
              <div className="row g-0">
                <div className="col-12 col-md-7">
                  <img
                    className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                    loading="lazy"
                    src="./register.gif"
                    alt="Register"
                  />
                </div>
                <div className="col-12 col-md-5 d-flex align-items-center justify-content-center">
                  <div className="col-12 col-lg-10 col-xl-9">
                    <div className="card-body p-3 p-md-4 p-xl-4">
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-4">
                            <h2 className="h4 text-center">Sign Up</h2>
                            <h3 className="fs-6 fw-normal text-secondary text-center m-0">
                              Create your account
                            </h3>
                          </div>
                        </div>
                      </div>
                      <form className="form" onSubmit={handleSubmit}>
                        <div className="row gy-3 overflow-hidden">
                          <div className="col-12">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Enter your Name"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                              <label htmlFor="username" className="form-label">Name</label>
                            </div>
                          </div>
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
                            <div className="form-floating mb-3">
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                              <label htmlFor="password" className="form-label">Password</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-grid">
                              <button className="btn btn-dark btn-lg" type="submit">
                                Sign Up
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                      <p className="p">
                        Already have an account? <span className="span" onClick={LoginHandler}>Login</span>
                      </p>
                      <p className="p line">Or With</p>
                      <div className="flex-row">
                        <GoogleLogin
                          onSuccess={handleGoogleSignupSuccess}
                          onError={handleGoogleSignupFailure}
                        />
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

export default Register;