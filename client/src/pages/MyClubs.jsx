// Author: Rachel Ha
import styles from '../css/MyClubs.module.css';

export default function MyClubs() {
  // Default data until MongoDB is connected
  const followedClubs = [
    { id: 1, name: "Computer Science Undergraduate Society", initials: "CSUS" },
    { id: 2, name: "DriveSafe", initials: "DS" },
    { id: 3, name: "McGill Esports", initials: "MES" },
    { id: 4, name: "McGill Students' Culinary Society", initials: "MSCS" },
    { id: 5, name: "McGill Association of North American Born Asians", initials: "MANABA" }
  ];

  return (
    <div className={styles.myclubsContainer}>
      <div className={styles.myclubsContent}>
        <h1 className={styles.pageTitle}>My Clubs</h1>
        <p className={styles.pageSubtitle}>Organizations you are currently following.</p>

        <div className={styles.clubsGrid}>
          {followedClubs.map((club) => (
            <div key={club.id} className={styles.clubCard}>
              <div className={styles.clubAvatar}>{club.initials}</div>
              <h3 className={styles.clubName}>{club.name}</h3>
              <button className={styles.followingBtn}>Following</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}