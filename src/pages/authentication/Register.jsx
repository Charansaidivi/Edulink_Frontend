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
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const validatePassword = (pass) => {
    const errors = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(error => error);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      toast.error('Please ensure your password meets all requirements');
      return;
    }

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
                                onChange={handlePasswordChange}
                                required
                              />
                              <label htmlFor="password" className="form-label">Password</label>
                            </div>
                            <div className="password-requirements mt-2">
                              <p className="mb-1">Password must contain:</p>
                              <ul className="list-unstyled">
                                <li className={passwordErrors.length ? 'text-success' : 'text-danger'}>
                                  ✓ At least 8 characters
                                </li>
                                <li className={passwordErrors.uppercase ? 'text-success' : 'text-danger'}>
                                  ✓ One uppercase letter
                                </li>
                                <li className={passwordErrors.lowercase ? 'text-success' : 'text-danger'}>
                                  ✓ One lowercase letter
                                </li>
                                <li className={passwordErrors.number ? 'text-success' : 'text-danger'}>
                                  ✓ One number
                                </li>
                                <li className={passwordErrors.special ? 'text-success' : 'text-danger'}>
                                  ✓ One special character
                                </li>
                              </ul>
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
                        <button onClick={googleLogin} className="button">
                          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                            <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                          </svg>
                          Continue with Google
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