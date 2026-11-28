// Author: Rachel Ha, Adam Ahmed
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import styles from '../css/EventAttendees.module.css';

export default function EventAttendees() {
  const { id } = useParams();

  // Event information and attendee names returned by the backend
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch event details and attendees using the event ID
  useEffect(() => {
    let ignore = false;

    async function loadAttendees() {
      setLoading(true);
      setError('');
      setEvent(null);
      setAttendees([]);

      try {
        // The attendees endpoint verifies organization admin permissions
        const [eventData, attendeeData] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get(`/api/events/${id}/attendees`)
        ]);

        if (ignore) return;

        setEvent(eventData);
        setAttendees(attendeeData.names);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadAttendees();

    // Ignore outdated responses when navigating between events
    return () => {
      ignore = true;
    };
  }, [id]);

  // Generate attendee initials from their names
  function getInitials(name) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  // TODO: Restore check-in controls and filters if backend
  // support for persistent check-in status is implemented.

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>

        {/* Back Link */}
        <div className={styles.topBar}>
          <Link
            to={id ? `/events/${id}` : '/explore'}
            className={styles.backLink}
          >
            ← Back to Event
          </Link>
        </div>

        {/* Loading and Error States */}
        {loading && <p>Loading attendees...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && event && (
          <>
            {/* Event Header & Stats */}
            <header className={styles.headerCard}>
              <div>
                <p className={styles.orgName}>
                  {event.organizationName}
                </p>

                <h1 className={styles.eventTitle}>
                  {event.title}
                </h1>

                <p className={styles.eventMeta}>
                  {new Date(event.date).toLocaleString()}
                  {event.location && ` • ${event.location}`}
                </p>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>
                    {attendees.length}
                    {event.capacity != null
                      ? `/${event.capacity}`
                      : ''}
                  </span>

                  <span className={styles.statLabel}>
                    RSVP&apos;d
                  </span>
                </div>
              </div>
            </header>

            {/* Tabs & Attendee List */}
            <section className={styles.rosterCard}>
              <div className={styles.tabsBar}>
                <span
                  className={`${styles.tabBtn} ${styles.tabBtnActive}`}
                >
                  Attendees ({attendees.length})
                </span>
              </div>

              {attendees.length === 0 ? (
                <div className={styles.emptyState}>
                  No attendees have RSVP'd yet.
                </div>
              ) : (
                <div className={styles.peopleList}>
                  {attendees.map((name, index) => (
                    <div
                      key={`${name}-${index}`}
                      className={styles.personRow}
                    >
                      <div className={styles.personInfo}>

                        {/* Swap to styles.avatarMember if you prefer red circles over gray */}
                        <div className={styles.avatarGuest}>
                          {getInitials(name)}
                        </div>

                        <div>
                          <div className={styles.nameLine}>
                            <h3 className={styles.personName}>
                              {name}
                            </h3>

                            <span className={styles.rsvpBadge}>
                              RSVP&apos;d
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}