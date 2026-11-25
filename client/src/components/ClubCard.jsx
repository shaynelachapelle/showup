// Author: Rachel Ha
import { Link } from 'react-router-dom';
import styles from '../css/ClubCard.module.css';

// TODO (Backend): Pass a club object from MongoDB with `_id` (or `id`) and `name`.
// Optional fields: `initials`, `category`, `imageUrl`.
// Example: <ClubCard club={{ _id: "1", name: "CSUS", initials: "CS", category: "Academic", imageUrl: "" }} />
export default function ClubCard({ club }) {
  const clubId = club._id || club.id;

  return (
    <Link to={`/organization/${clubId}`} className={styles.card}>
      <div className={styles.avatarWrapper}>
        {club.imageUrl ? (
          <img
            src={club.imageUrl}
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