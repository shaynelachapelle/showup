// Author: Rachel Ha
import '../css/Landing.css';

export default function Landing() {
  return (
    <div className="landing-container">
      
      <div className="logo-section">
        <span className="logo-text">McGill</span> Events
      </div>

      <div className="text-section">
        <h1>CAMPUS EVENTS</h1>
        <h2>Only for students. Browse events near you.</h2>
      </div>

      <div className="image-section">
        <div className="image-placeholder">
          <p>Image of Marty the Martlet</p>
        </div>
      </div>

      <div className="auth-box">
        <p>Are you a student?</p>
        <div className="auth-buttons">
          <button className="login-btn">Log In</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>

    </div>
  );
}