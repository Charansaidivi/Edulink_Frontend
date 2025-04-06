import React, { useState } from 'react';
import { API_URL } from '../../data/apiData';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        setEmail('');
        setName('');
        setPassword('');
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  // Google Login with Authorization Code Flow using useGoogleLogin
  const googleLogin = useGoogleLogin({
    flow: 'auth-code', // Request an authorization code
    scope: 'https://www.googleapis.com/auth/calendar openid email profile', // Required scopes
    onSuccess: async (response) => {
      try {
        console.log('Authorization Code:', response.code); // Log the code
        const serverResponse = await fetch(`${API_URL}/student/google-auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: response.code }),
        });
        const data = await serverResponse.json();
        if (serverResponse.ok) {
          localStorage.setItem('loginToken', data.token);
          localStorage.setItem('googleAccessToken', data.googleAccessToken); // Store for later use if needed
          toast.success('Google signup successful!');
          navigate('/home');
        } else {
          toast.error(data.message || 'Google signup failed');
        }
      } catch (error) {
        console.error('Google auth error:', error);
        toast.error('Failed to authenticate with Google');
      }
    },
    onError: (error) => {
      console.error('Google Signup Error:', error);
      toast.error('Google signup failed');
    },
  });

  const LoginHandler = () => {
    navigate('/login');
  };

  return (
    <section className="bg-white p-3 p-md-4 p-xl-5">
      <ToastContainer position="top-right" autoClose={3000} />
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
                        {/* Custom button to trigger Google signup */}
                        <button onClick={googleLogin} className="btn btn-google">
                          Sign up with Google
                        </button>
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