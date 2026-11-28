// Author: Rachel Ha
import { Link } from 'react-router-dom';
import styles from '../css/ClubCard.module.css';

export default function ClubCard({ club }) {
  const clubId = club.id || club._id;
  const clubImage = club.image || club.imageUrl;

  return (
    <Link to={`/organization/${clubId}`} className={styles.card}>
      <div className={styles.avatarWrapper}>
        {clubImage ? (
          <img
            src={clubImage}
            alt={`${club.name} logo`}
            className={styles.avatarImg}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {club.initials || club.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <h3 className={styles.clubName}>{club.name}</h3>

      {club.category && (
        <span className={styles.categoryBadge}>{club.category}</span>
      )}
    </Link>
  );
}