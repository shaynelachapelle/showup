// Author: Rachel Ha
import styles from '../css/Landing.module.css';
import martyImage from '../assets/alpha_marty.jpg';

export default function Landing() {
  return (
    <div className={styles.landingContainer}>
      
      {/* Red Bar */}
      <nav className={styles.redBar}>
        <div className={styles.logoSection}>
          <span className={styles.logoText}>Show</span>up
        </div>
      </nav>

      {/* Main Page Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.textSection}>
          <h1>CAMPUS <span className={styles.titleHighlight}>EVENTS</span></h1>
          <h2>Only for students. Browse events near you.</h2>
          
          <div className={styles.authButtonsInline}>
            <button className={styles.loginBtn}>Log In</button>
            <button className={styles.signupBtn}>Sign Up</button>
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