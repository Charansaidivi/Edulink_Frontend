import React, { useState } from 'react';
import { API_URL } from '../data/apiData';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ SignupHandler }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const HandleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/student/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        localStorage.setItem('loginToken', data.token);
        alert('Vendor login successfully');
        setEmail('');
        setPassword('');
        navigate('/home');
      } else {
        console.error('Error Response:', data);
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Login failed');
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    console.log('Google login success:', response);
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
        localStorage.setItem('loginToken', data.token);
        alert('Login successful');
        navigate('/home');
      } else {
        console.error('Server error:', data);
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Login failed');
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failed:', error);
    alert('Google login failed');
  };

  return (
    <section className="bg-white p-3 p-md-4 p-xl-5">
      <div className="container bg-white">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            <div className="card border-light-subtle shadow-sm">
              <div className="row g-0">
                <div className="col-12 col-md-7">
                  <img
                    className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                    loading="lazy"
                    src="./login1.gif"
                    alt="Login"
                  />
                </div>
                <div className="col-12 col-md-5 d-flex align-items-center justify-content-center">
                  <div className="col-12 col-lg-11 col-xl-10">
                    <div className="card-body p-3 p-md-4 p-xl-5">
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-4">
                            <h2 className="h4 text-center">Sign In</h2>
                            <h3 className="fs-6 fw-normal text-secondary text-center m-0">
                              Enter your credentials to access your account
                            </h3>
                          </div>
                        </div>
                      </div>
                      <form className="form" onSubmit={HandleLogin}>
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
                                Sign In
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                      <p className="p">
                        Don't have an account? <span className="span" onClick={SignupHandler}>Sign Up</span>
                      </p>
                      <p className="p">
                        <span className="span" onClick={() => navigate('/request-password-reset')}>
                          Forgot Password?
                        </span>
                      </p>
                      <p className="p line">Or With</p>
                      <div className="flex-row">
                        <GoogleLogin
                          onSuccess={handleGoogleLoginSuccess}
                          onError={handleGoogleLoginFailure}
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

export default Login;