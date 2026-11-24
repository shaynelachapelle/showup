// Author: Rachel Ha
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../css/OrganizationPage.module.css';

// TODO (Backend): Replace MOCK_CLUBS with GET /api/organizations/:organizationId
// Expected club fields: { _id, name, initials, category, memberCount, email, description, ownerId, upcomingEvents: [{ id, title, date, location, rsvpCount }] }
const MOCK_CLUBS = {
  csus: {
    id: 'csus',
    name: 'Computer Science Undergraduate Society',
    initials: 'CSUS',
    category: 'Academic',
    memberCount: 420,
    email: 'csus@cs.mcgill.ca',
    description:
      'Representing all undergraduate Computer Science students at McGill. We host tech talks, hackathons, study nights, and social mixers throughout the semester.',
    upcomingEvents: [
      { id: 1, title: 'Winter Technical Interview Workshop', date: 'Nov 28, 2026 • 6:00 PM', location: 'Trottier 3120', rsvpCount: 42 },
      { id: 2, title: 'CSUS Coffee & Code Social', date: 'Dec 3, 2026 • 4:30 PM', location: 'Trottier 3rd Floor Lounge', rsvpCount: 28 }
    ]
  },
  drivesafe: {
    id: 'drivesafe',
    name: 'DriveSafe',
    initials: 'DS',
    category: 'Service',
    memberCount: 115,
    email: 'drivesafe@ssmu.ca',
    description:
      'A free student-run safe ride service getting McGill students home safely anywhere on the Island of Montreal.',
    upcomingEvents: [
      { id: 3, title: 'Volunteer Driver Info Session', date: 'Dec 1, 2026 • 5:30 PM', location: 'SSMU Building 203', rsvpCount: 19 }
    ]
  },
  esports: {
    id: 'esports',
    name: 'McGill Esports',
    initials: 'ME',
    category: 'Gaming',
    memberCount: 260,
    email: 'esports@ssmu.ca',
    description:
      'McGill’s competitive and casual gaming community. Join us for weekly watch parties, in-house tournaments, and collegiate teams.',
    upcomingEvents: [
      { id: 4, title: 'Fall Semester LAN & Watch Party', date: 'Dec 5, 2026 • 7:00 PM', location: 'SSMU Ballroom', rsvpCount: 64 }
    ]
  }
};

export default function OrganizationPage() {
  const { organizationId } = useParams();
  const initialClub = MOCK_CLUBS[organizationId?.toLowerCase()] || MOCK_CLUBS.csus;

  const [club, setClub] = useState(initialClub);
  const [isFollowing, setIsFollowing] = useState(false);

  // TODO (Backend): Replace this toggle with a real check (e.g., currentUser._id === club.ownerId)
  const [isOwner, setIsOwner] = useState(false);

  // Owner inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    description: initialClub.description,
    email: initialClub.email
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    // TODO (Backend): Send PATCH /api/organizations/:organizationId with editForm
    setClub((prev) => ({
      ...prev,
      description: editForm.description,
      email: editForm.email
    }));
    setIsEditing(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>

        {/* Temporary Preview Toggle (Remove once backend auth is connected) */}
        <div className={styles.previewBar}>
          <span className={styles.previewText}>
            Viewing as: <strong>{isOwner ? 'Club Owner' : 'Student'}</strong>
          </span>
          <button
            type="button"
            className={styles.switchViewBtn}
            onClick={() => {
              setIsOwner((prev) => !prev);
              setIsEditing(false);
            }}
          >
            Switch to {isOwner ? 'Student View' : 'Owner View'}
          </button>
        </div>

        {/* Club Header Card */}
        <header className={styles.headerCard}>
          <div className={styles.clubIdentity}>
            <div className={styles.clubAvatar}>{club.initials}</div>
            <div>
              <div className={styles.badgeRow}>
                <span className={styles.categoryBadge}>{club.category}</span>
                {isOwner && <span className={styles.ownerBadge}>Admin View</span>}
              </div>
              <h1 className={styles.clubName}>{club.name}</h1>
              <p className={styles.clubMeta}>
                {club.memberCount} members • {club.email}
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {isOwner ? (
              <>
                <Link to="/post-event" className={styles.primaryBtn}>
                  + Post Event
                </Link>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Club'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={isFollowing ? styles.followingBtn : styles.primaryBtn}
                  onClick={() => {
                    // TODO (Backend): POST/DELETE /api/organizations/:organizationId/follow
                    setIsFollowing((prev) => !prev);
                  }}
                >
                  {isFollowing ? 'Following ✓' : 'Follow'}
                </button>
                <Link to="/joinclub" className={styles.secondaryBtn}>
                  Join Club
                </Link>
              </>
            )}
          </div>
        </header>

        {/* About Section (Editable for Owners) */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>About</h2>

          {isOwner && isEditing ? (
            <form onSubmit={handleSaveEdit} className={styles.editForm}>
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>Contact Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="description" className={styles.label}>Description</label>
                <textarea
                  id="description"
                  rows="4"
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.editActions}>
                <button type="submit" className={styles.primaryBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <p className={styles.description}>{club.description}</p>
          )}
        </section>

        {/* Upcoming Events Section */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            {isOwner && (
              <span className={styles.eventCountTag}>
                {club.upcomingEvents.length} active
              </span>
            )}
          </div>

          {club.upcomingEvents.length === 0 ? (
            <p className={styles.emptyText}>No upcoming events scheduled yet.</p>
          ) : (
            <div className={styles.eventsList}>
              {club.upcomingEvents.map((event) => (
                <div key={event.id} className={styles.eventItem}>
                  <div>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventMeta}>
                      {event.date} • {event.location}
                      {isOwner && ` • ${event.rsvpCount} RSVP'd`}
                    </p>
                  </div>

                  <div className={styles.eventActions}>
                    {isOwner && (
                      <Link
                        to={`/events/${event.id}/attendees`}
                        className={styles.attendeesBtn}
                      >
                        Attendees
                      </Link>
                    )}
                    <Link to={`/events/${event.id}`} className={styles.viewEventBtn}>
                      View Event
                    </Link>
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