import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Top Navbar */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          <div className="logo-badge">MS</div>
          <h4 className="logo-text">
            MASTER<span className="logo-light">STUDY</span>
          </h4>
        </div>
        <div className="landing-nav-links">
          {["DEMOS", "FEATURES", "PAGES", "COURSES", "COURSE BUILDER"].map((item, i) => (
            <span key={i} className="nav-link-text">
              {item}
            </span>
          ))}
          <span className="nav-link-new">WHAT’S NEW</span>
          <span className="nav-separator">|</span>
          <span className="nav-link-text">PURCHASE 🛒</span>
        </div>
      </nav>
      <div className="hero-wrapper d-flex align-items-center justify-content-between flex-wrap">
        <div className="hero-section container text-left">
          <h1 className="hero-title">
            THE BEST <span className="highlight">EDUCATION</span><br />
            WORDPRESS THEME
          </h1>
          <p className="featured-text">
            featured on <img src="https://cdn.worldvectorlogo.com/logos/envato.svg" alt="Envato" className="envato-logo" /> tuts+
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
