// Author: Rachel Ha
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../css/EventAttendees.module.css';

// TODO (Backend): Replace MOCK_EVENT and INITIAL_PEOPLE with a GET request using `id` from useParams()
// e.g., GET /api/events/:id/attendees
// Expected event fields: { id, title, organization, date, location, capacity }
// Expected people fields: [{ id, name, initials, isAttendee, isMember, role, checkedIn }]
// Temporary mock data until connected to MongoDB
const MOCK_EVENT = {
  id: '1',
  title: 'Winter Technical Interview Workshop',
  organization: 'Computer Science Undergraduate Society (CSUS)',
  date: 'Nov 28, 2026 • 6:00 PM',
  location: 'Trottier 3120',
  capacity: 60
};

const INITIAL_PEOPLE = [
  { id: 1, name: 'Rachel Ha', initials: 'RH', isAttendee: true, isMember: true, role: 'Exec', checkedIn: true },
  { id: 2, name: 'Adam Ahmed', initials: 'AA', isAttendee: true, isMember: true, role: 'Member', checkedIn: true },
  { id: 3, name: 'Grace Yuzwin', initials: 'GY', isAttendee: true, isMember: false, role: 'Guest', checkedIn: false },
  { id: 4, name: 'Shayne Lachapelle', initials: 'SL', isAttendee: true, isMember: false, role: 'Guest', checkedIn: false },
  { id: 5, name: 'Joseph Vybihal', initials: 'JV', isAttendee: false, isMember: true, role: 'Exec', checkedIn: false },
  { id: 6, name: 'Kim Jong', initials: 'KJ', isAttendee: false, isMember: true, role: 'Member', checkedIn: false }
];

export default function EventAttendees() {
  const { id } = useParams();
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'attendees' | 'members'

  const attendeesCount = people.filter((p) => p.isAttendee).length;
  const membersCount = people.filter((p) => p.isMember).length;
  const checkedInCount = people.filter((p) => p.isAttendee && p.checkedIn).length;

  const filteredPeople = people.filter((person) => {
    if (activeTab === 'attendees') return person.isAttendee;
    if (activeTab === 'members') return person.isMember;
    return true;
  });

  const toggleCheckIn = (personId) => {
    // TODO (Backend): Persist check-in status in MongoDB
    // e.g., PATCH /api/events/:id/attendees/:personId with { checkedIn: !currentStatus }
    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, checkedIn: !p.checkedIn } : p
      )
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        {/* Back Link & Event Header */}
        <div className={styles.topBar}>
          <Link to={id ? `/events/${id}` : '/allevents'} className={styles.backLink}>
            ← Back to Event
          </Link>
        </div>

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
                {attendeesCount}/{MOCK_EVENT.capacity}
              </span>
              <span className={styles.statLabel}>RSVP&apos;d</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>{checkedInCount}</span>
              <span className={styles.statLabel}>Checked In</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>{membersCount}</span>
              <span className={styles.statLabel}>Club Members</span>
            </div>
          </div>
        </header>

        {/* Tabs & Roster List */}
        <section className={styles.rosterCard}>
          <div className={styles.tabsBar}>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={
                activeTab === 'all'
                  ? `${styles.tabBtn} ${styles.tabBtnActive}`
                  : styles.tabBtn
              }
            >
              All ({people.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attendees')}
              className={
                activeTab === 'attendees'
                  ? `${styles.tabBtn} ${styles.tabBtnActive}`
                  : styles.tabBtn
              }
            >
              Attendees ({attendeesCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={
                activeTab === 'members'
                  ? `${styles.tabBtn} ${styles.tabBtnActive}`
                  : styles.tabBtn
              }
            >
              Club Members ({membersCount})
            </button>
          </div>

          {filteredPeople.length === 0 ? (
            <div className={styles.emptyState}>
              No one listed in this category yet.
            </div>
          ) : (
            <div className={styles.peopleList}>
              {filteredPeople.map((person) => (
                <div key={person.id} className={styles.personRow}>
                  <div className={styles.personInfo}>
                    <div
                      className={
                        person.isMember
                          ? styles.avatarMember
                          : styles.avatarGuest
                      }
                    >
                      {person.initials}
                    </div>
                    <div>
                      <div className={styles.nameLine}>
                        <h3 className={styles.personName}>{person.name}</h3>
                        {person.isMember && (
                          <span className={styles.memberBadge}>
                            {person.role === 'Exec' ? 'Club Exec' : 'Club Member'}
                          </span>
                        )}
                        {person.isAttendee && (
                          <span className={styles.rsvpBadge}>RSVP&apos;d</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.rowActions}>
                    {person.isAttendee ? (
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
                    ) : (
                      <span className={styles.notRsvpdLabel}>Not RSVP&apos;d</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}