// Author: Rachel Ha
import { useState } from 'react';
import styles from '../css/JoinClub.module.css';

export default function JoinClub() {
  const availableClubs = [
    "Computer Science Undergraduate Society (CSUS)",
    "DriveSafe",
    "McGill Esports",
    "McGill Students' Culinary Society",
    "McGill Association of North American Born Asians (MANABA)"
  ];

  const [formData, setFormData] = useState({
    club: availableClubs[0],
    fullName: '',
    email: '',
    major: '',
    reason: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send formData to backend with fetch()
    console.log('Club join request:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>You're In!</h1>
          <p className={styles.subtitle}>
            Your request to join <strong>{formData.club}</strong> has been submitted.
          </p>
          <button
            className={styles.submitBtn}
            onClick={() => setSubmitted(false)}
          >
            Join Another Club
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Join a <span className={styles.highlight}>Club</span></h1>
        <p className={styles.subtitle}>Fill out your details to connect with a McGill student organization.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="club" className={styles.label}>Select Club</label>
            <select
              id="club"
              name="club"
              value={formData.club}
              onChange={handleChange}
              className={styles.input}
            >
              {availableClubs.map((club) => (
                <option key={club} value={club}>{club}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="fullName" className={styles.label}>Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="e.g., Marty Martlet"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>McGill Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="firstname.lastname@mail.mcgill.ca"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="major" className={styles.label}>Major / Program</label>
            <input
              id="major"
              name="major"
              type="text"
              placeholder="e.g., Computer Science"
              value={formData.major}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reason" className={styles.label}>Why do you want to join? (Optional)</label>
            <textarea
              id="reason"
              name="reason"
              rows="4"
              placeholder="Tell the club a bit about your interests..."
              value={formData.reason}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}