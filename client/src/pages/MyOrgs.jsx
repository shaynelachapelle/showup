// Author: Adam Ahmed
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import styles from '../css/MyClubs.module.css';

export default function MyOrgs() {
  // Organizations administered by the logged-in user
  const [organizations, setOrganizations] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch organizations that the user administers
  useEffect(() => {
    async function loadOrganizations() {
      try {
        const data = await api.get('/api/orgs/administered');

        setOrganizations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrganizations();
  }, []);

  return (
    <div className={styles.myclubsContainer}>
      <div className={styles.myclubsContent}>
        <h1 className={styles.pageTitle}>My Organizations</h1>
        <p className={styles.pageSubtitle}>
          Organizations you currently administer.
        </p>

        {/* Loading and error states */}
        {loading && <p>Loading organizations...</p>}

        {error && <p role="alert">{error}</p>}

        {/* Empty state for students without organizations */}
        {!loading && !error && organizations.length === 0 && (
          <p>You do not administer any organizations yet.</p>
        )}

        {/* Organization cards */}
        <div className={styles.clubsGrid}>
          {organizations.map((org) => (
            <div key={org.id} className={styles.clubCard}>
              <div className={styles.clubAvatar}>
                {/* Display the logo or fallback initials */}
                {org.image ? (
                  <img
                    src={org.image}
                    alt={`${org.name} logo`}
                    className={styles.clubLogo}
                  />
                ) : (
                  org.name.slice(0, 2).toUpperCase()
                )}
              </div>

              <h3 className={styles.clubName}>
                <Link
                  to={`/organization/${org.id}`}
                  className={styles.clubLink}
                >
                  {org.name}
                </Link>
              </h3>

              {/* Navigate to the organization management page */}
              <Link
                to={`/organization/${org.id}`}
                className={styles.followingBtn}
                style={{ textDecoration: 'none' }}
              >
                Manage Organization
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}