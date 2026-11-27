// Author: Rachel Ha, Adam Ahmed
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import styles from '../css/MyClubs.module.css';

export default function MyClubs() {
  const [followedClubs, setFollowedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadClubs() {
      try {
        const data = await api.get(
          '/api/orgs/my-organizations?limit=100'
        );

        setFollowedClubs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadClubs();
  }, []);

  async function handleUnfollow(club) {
    const confirmed = window.confirm(
      `Are you sure you want to unfollow ${club.name}?`
    );

    if (!confirmed) return;

    try {
      setError('');

      await api.delete(`/api/orgs/${club.id}/join`);

      setFollowedClubs((previousClubs) =>
        previousClubs.filter((item) => item.id !== club.id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.myclubsContainer}>
      <div className={styles.myclubsContent}>
        <h1 className={styles.pageTitle}>My Clubs</h1>
        <p className={styles.pageSubtitle}>
          Organizations you are currently following.
        </p>

        {loading && <p>Loading clubs...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && followedClubs.length === 0 && (
          <p>You are not following any organizations yet.</p>
        )}

        <div className={styles.clubsGrid}>
          {followedClubs.map((club) => (
            <div key={club.id} className={styles.clubCard}>
              <div className={styles.clubAvatar}>
                {club.image ? (
                  <img
                    src={club.image}
                    alt={`${club.name} logo`}
                    className={styles.clubLogo}
                  />
                ) : (
                  club.initials || club.name.slice(0, 2).toUpperCase()
                )}
              </div>

              <h3 className={styles.clubName}>
                <Link
                  to={`/organization/${club.id}`}
                  className={styles.clubLink}
                >
                  {club.name}
                </Link>
              </h3>
              <button
                className={styles.followingBtn}
                onClick={() => handleUnfollow(club)}
              >
                Following
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}