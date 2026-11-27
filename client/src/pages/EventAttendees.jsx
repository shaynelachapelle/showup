// Author: Rachel Ha
import { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import styles from '../css/EventAttendees.module.css';

// TODO (Backend): Replace MOCK_EVENT and INITIAL_ATTENDEES with a GET request using `id` from useParams()
// e.g., GET /api/events/:id/attendees
// Expected event fields: { id, title, organization, date, location, capacity }
// Expected attendee fields: [{ id, name, initials, checkedIn }]
const MOCK_EVENT = {
  id: '1',
  title: 'Winter Technical Interview Workshop',
  organization: 'Computer Science Undergraduate Society (CSUS)',
  date: 'Nov 28, 2026 • 6:00 PM',
  location: 'Trottier 3120',
  capacity: 60
};

const INITIAL_ATTENDEES = [
  { id: 1, name: 'Rachel Ha', initials: 'RH', checkedIn: true },
  { id: 2, name: 'Adam Ahmed', initials: 'AA', checkedIn: true },
  { id: 3, name: 'Grace Yuzwin', initials: 'GY', checkedIn: false },
  { id: 4, name: 'Shayne Lachapelle', initials: 'SL', checkedIn: false }
];

export default function EventAttendees() {
  const { id } = useParams();
  const location = useLocation();

  // Checks if the user came from Owner View or Student View (defaults to Student View)
  // TODO (Backend): Verify if the logged-in user owns this club
  const isOwner = location.state?.isOwner ?? false;

  const [attendees, setAttendees] = useState(INITIAL_ATTENDEES);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'checkedIn' | 'notCheckedIn'

  const checkedInCount = attendees.filter((p) => p.checkedIn).length;
  const notCheckedInCount = attendees.length - checkedInCount;

  // Students see everyone going; owners can filter by check-in status
  const filteredAttendees = attendees.filter((person) => {
    if (!isOwner) return true;
    if (activeTab === 'checkedIn') return person.checkedIn;
    if (activeTab === 'notCheckedIn') return !person.checkedIn;
    return true;
  });

  const toggleCheckIn = (personId) => {
    if (!isOwner) return;

    // TODO (Backend): Save check-in status in MongoDB
    // e.g., PATCH /api/events/:id/attendees/:personId with { checkedIn: !currentStatus }
    setAttendees((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, checkedIn: !p.checkedIn } : p
      )
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        {/* Back Link */}
        <div className={styles.topBar}>
          <Link to={id ? `/events/${id}` : '/allevents'} className={styles.backLink}>
            ← Back to Event
          </Link>
        </div>

        {/* Event Header & Stats */}
        <header className={styles.headerCard}>
          <div>
            <p className={styles.orgName}>{MOCK_EVENT.organization}</p>
            <h1 className={styles.eventTitle}>{MOCK_EVENT.title}</h1>
            <p className={styles.eventMeta}>
              {MOCK_EVENT.date} • {MOCK_EVENT.location}
            </p>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>
                {attendees.length}/{MOCK_EVENT.capacity}
              </span>
              <span className={styles.statLabel}>RSVP&apos;d</span>
            </div>

            {isOwner && (
              <div className={styles.statBox}>
                <span className={styles.statNumber}>{checkedInCount}</span>
                <span className={styles.statLabel}>Checked In</span>
              </div>
            )}
          </div>
        </header>

        {/* Tabs & Attendee List */}
        <section className={styles.rosterCard}>
          <div className={styles.tabsBar}>
            {isOwner ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={
                    activeTab === 'all'
                      ? `${styles.tabBtn} ${styles.tabBtnActive}`
                      : styles.tabBtn
                  }
                >
                  All ({attendees.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('checkedIn')}
                  className={
                    activeTab === 'checkedIn'
                      ? `${styles.tabBtn} ${styles.tabBtnActive}`
                      : styles.tabBtn
                  }
                >
                  Checked In ({checkedInCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notCheckedIn')}
                  className={
                    activeTab === 'notCheckedIn'
                      ? `${styles.tabBtn} ${styles.tabBtnActive}`
                      : styles.tabBtn
                  }
                >
                  Not Checked In ({notCheckedInCount})
                </button>
              </>
            ) : (
              <span className={`${styles.tabBtn} ${styles.tabBtnActive}`}>
                Attendees ({attendees.length})
              </span>
            )}
          </div>

          {filteredAttendees.length === 0 ? (
            <div className={styles.emptyState}>
              No attendees in this category yet.
            </div>
          ) : (
            <div className={styles.peopleList}>
              {filteredAttendees.map((person) => (
                <div key={person.id} className={styles.personRow}>
                  <div className={styles.personInfo}>
                    {/* Swap to styles.avatarMember if you prefer red circles over gray */}
                    <div className={styles.avatarGuest}>
                      {person.initials}
                    </div>
                    <div>
                      <div className={styles.nameLine}>
                        <h3 className={styles.personName}>{person.name}</h3>
                        <span className={styles.rsvpBadge}>RSVP&apos;d</span>
                      </div>
                    </div>
                  </div>

                  {isOwner && (
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        onClick={() => toggleCheckIn(person.id)}
                        className={
                          person.checkedIn
                            ? styles.checkedInBtn
                            : styles.checkInBtn
                        }
                      >
                        {person.checkedIn ? 'Checked In ✓' : 'Check In'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}