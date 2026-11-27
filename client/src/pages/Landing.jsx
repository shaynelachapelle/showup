// Author: Rachel Ha
import { useNavigate } from 'react-router-dom';
import styles from '../css/Landing.module.css';
import martyImage from '../assets/alpha_marty.jpg';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.landingContainer}>
      
      {/* Red Bar */}
      <nav className={styles.redBar}>
        <div className={styles.logoSection}>
          <span className={styles.logoText}>Show</span>up
        </div>
        <button
          type="button"
          className={styles.contactBtn}
          onClick={() => navigate('/contactus')}
        >
          Contact Us
        </button>
      </nav>

      {/* Main Page Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.textSection}>
          <h1>CAMPUS <span className={styles.titleHighlight}>EVENTS</span></h1>
          <h2>Only for students. Browse events near you.</h2>
          
          <div className={styles.authButtonsInline}>
            <button
              type="button"
              className={styles.loginBtn}
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            <button
              type="button"
              className={styles.signupBtn}
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className={styles.imageSection}>
          <div className={styles.imagePlaceholder}>
            <img src={martyImage} alt="Marty the Martlet" className={styles.martyHeroImg} />
          </div>
        </div>
      </div>

    </div>
  );
}