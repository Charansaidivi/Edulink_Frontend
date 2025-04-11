import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Add background when scrolled
      } else {
        setIsScrolled(false); // Remove background when at the top
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Top Navbar */}
      <nav className={`landing-navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="landing-logo">
          <img
            src="./logo2.png" // Replace with the actual path to your logo
            alt="MasterStudy Logo"
            className="logo-image"
          />
          <div className="nav-links-left">
            <span className="nav-link-text" onClick={() => navigate("/")}>
              Home
            </span>
            <span className="nav-link-text" onClick={() => navigate("/about")}>
              About
            </span>
          </div>
        </div>
        <div className="landing-nav-links-right">
          <button className="btn login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn signup-btn" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>
      </nav>
      <div className="hero-wrapper d-flex align-items-center justify-content-between flex-wrap">
        <div className="hero-section container text-left">
          <h1 className="hero-title">
            <span className="highlight">Learn Together.</span> Build Together. <span className="highlight">Rise Together.</span>
            <br />
            <span className="subtext">
              'Because real growth happens when minds connect.'
            </span>
          </h1>
          <p className="featured-text">
            Dive into a platform where knowledge flows freely, collaboration fuels innovation, and every student has a chance to lead, learn, and leave a legacy.
          </p>
          <div className="cta-buttons">
            <button className="btn watch-btn">WATCH</button>
            <button className="btn get-btn">GET NOW</button>
          </div>
        </div>

        {/* Hero Image with Overlays */}
        <div className="hero-image-container">
          <img src="./hero1.svg" alt="Hero" className="hero-image" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
