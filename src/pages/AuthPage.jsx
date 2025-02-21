import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
// import './AuthPage.css'; // Import the CSS file

const AuthPage = () => {
  const [login, setLogin] = useState(true);
  const [signup, setSignup] = useState(false);

  const LoginHandler = () => {
    setLogin(true);
    setSignup(false);
  };

  const SignupHandler = () => {
    setLogin(false);
    setSignup(true);
  };

  return (
    <div className="auth-container">
      <div className="image-container">
        <img src="/Group.png" alt="Group" className="responsive-image" />
      </div>
      <div className="form-container">
        {login && <Login SignupHandler={SignupHandler} />}
        {signup && <Register LoginHandler={LoginHandler} />}
      </div>
    </div>
  );
};

export default AuthPage;