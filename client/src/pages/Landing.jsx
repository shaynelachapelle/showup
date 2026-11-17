// Author: Rachel Ha
import '../css/Landing.css';
import martyImage from '../assets/alpha_marty.jpg';

export default function Landing() {
  return (
    <div className="landing-container">
      
      {/* Navigation Bar (Logo Only) */}
      <nav className="navbar">
        <div className="logo-section">
          <span className="logo-text">Show</span>up
        </div>
      </nav>

      {/* Main Page Content */}
      <div className="content-wrapper">
        <div className="text-section">
          <h1>CAMPUS <span className="title-highlight">EVENTS</span></h1>
          <h2>Only for students. Browse events near you.</h2>
          
          {/* Buttons placed perfectly above Marty */}
          <div className="auth-buttons-inline">
            <button className="login-btn">Log In</button>
            <button className="signup-btn">Sign Up</button>
          </div>
        </div>

        <div className="image-section">
          <div className="image-placeholder">
            <img src={martyImage} alt="Marty the Martlet" className="marty-hero-img" />
          </div>
        </div>
      </div>

    </div>
  );
}