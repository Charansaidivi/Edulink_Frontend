import React, { useState } from "react";
// import "./Navbar.css"; // Import the CSS file for styles

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the state
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" >
      <div className="container-fluid" id="navbar">
        <img
          src="/assets/sai.png" // Path to the image in the public directory
          alt="Logo"
          className="navbar-logo"
        />
        <input type="checkbox" id="checkbox" onChange={toggleMenu} />
        <label htmlFor="checkbox" className="toggle">
          <div className="bar bar--top"></div>
          <div className="bar bar--middle"></div>
          <div className="bar bar--bottom"></div>
        </label>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarTogglerDemo01">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 justify-content-center">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/create-class">Create Class</a>
            </li>
          </ul>
          <div className="profile-container">
            <button className="profile-button">
              <img
                src="/sai.png"
                alt="Profile"
                className="profile-image"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;