// Author: Rachel Ha
import { Link } from 'react-router-dom';
import styles from '../css/ContactUs.module.css';

export default function ContactUs() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* Back to Landing Page */}
        <div className={styles.topBar}>
          <Link to="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <header className={styles.headerCard}>
          <span className={styles.badge}>Showup Support</span>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have a question about your student account, setting up a club page, or using Showup? Reach out to our team below.
          </p>
        </header>

        {/* Contact Info Cards */}
        <div className={styles.cardsGrid}>
          <div className={styles.infoCard}>
            <div className={styles.iconCircle}>✉</div>
            <h2 className={styles.cardTitle}>Account &amp; Technical Support</h2>
            <p className={styles.cardText}>
              Need help logging in with your McGill email, reporting a bug, or flagging a post?
            </p>
            <a href="mailto:support@showupmcgill.ca" className={styles.contactLink}>
              support@showupmcgill.ca
            </a>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconCircle}>🏛</div>
            <h2 className={styles.cardTitle}>Club &amp; Organizer Support</h2>
            <p className={styles.cardText}>
              Questions about managing your club page, verifying an official campus group, or hosting events?
            </p>
            <a href="mailto:clubs@showupmcgill.ca" className={styles.contactLink}>
              clubs@showupmcgill.ca
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}