// Author: Rachel Ha, Adam Ahmed
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import styles from '../css/OrganizationPage.module.css';

export default function OrganizationPage() {
  const { organizationId } = useParams();

  // Organization data and following status
  const [club, setClub] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Admin status determined by the backend instead of a preview toggle
  const [isOwner, setIsOwner] = useState(false);

  // Loading, error and request states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingFollow, setUpdatingFollow] = useState(false);

  // Organization members and member list visibility
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState('');

  // Owner inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  // Edit request and error states
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Fetch organization details and check admin permissions
  useEffect(() => {
    let ignore = false;

    async function loadClub() {
      setLoading(true);
      setError('');
      setActionError('');
      setIsOwner(false);
      setClub(null);
      
      // Reset the member list when navigating to another organization
      setMembers([]);
      setShowMembers(false);
      setLoadingMembers(false);
      setMembersError('');

      // Reset the edit form when navigating to another organization
      setIsEditing(false);
      setEditForm({
        name: '',
        description: '',
        image: ''
      });
      setSavingEdit(false);
      setEditError('');

      try {
        // Fetch both endpoints in parallel
        const [clubData, administeredOrgs] = await Promise.all([
          api.get(`/api/orgs/${organizationId}`),
          api.get('/api/orgs/administered')
        ]);

        if (ignore) return;

        setClub(clubData);
        setIsFollowing(clubData.isJoined);

        // Check whether the logged-in student administers this organization
        setIsOwner(
          administeredOrgs.some((org) => org.id === organizationId)
        );
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadClub();

    // Ignore outdated responses when navigating between organizations
    return () => {
      ignore = true;
    };
  }, [organizationId]);

  // Follow or unfollow the organization through the backend
  async function handleFollow() {
    // Prevent repeated requests while an update is in progress
    if (updatingFollow) return;

    setUpdatingFollow(true);
    setActionError('');

    try {
      if (isFollowing) {
        await api.delete(`/api/orgs/${organizationId}/join`);
      } else {
        await api.post(`/api/orgs/${organizationId}/join`);
      }

      // Update the following status only after a successful request
      setIsFollowing((prev) => !prev);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingFollow(false);
    }
  }

  // Fetch and display organization members for administrators
  async function handleViewMembers() {
    if (!isOwner || loadingMembers) return;

    // Hide the member list if it is already visible
    if (showMembers) {
      setShowMembers(false);
      return;
    }

    setLoadingMembers(true);
    setMembersError('');
    setShowMembers(true);

    try {
      const data = await api.get(
        `/api/orgs/${organizationId}/members`
      );

      setMembers(data.names);
    } catch (err) {
      setMembersError(err.message);
    } finally {
      setLoadingMembers(false);
    }
  }

  // Open or close the organization edit form
  function handleToggleEdit() {
    if (!isOwner || savingEdit) return;

    setEditError('');

    // Populate the form with the current organization information
    if (!isEditing) {
      setEditForm({
        name: club.name,
        description: club.description,
        image: club.image || ''
      });
    }

    setIsEditing((prev) => !prev);
  }
  
  // Save updated organization information to the backend
  async function handleSaveEdit(e) {
    e.preventDefault();

    if (!isOwner || savingEdit) return;

    setSavingEdit(true);
    setEditError('');

    try {
      // Prepare the updated organization information
      const updates = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        image: editForm.image.trim()
      };

      // Save the changes in MongoDB
      await api.patch(`/api/orgs/${organizationId}`, updates);

      // Retrieve the updated organization information
      const updatedClub = await api.get(
        `/api/orgs/${organizationId}`
      );

      setClub(updatedClub);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <p>Loading organization...</p>
      </div>
    );
  }

  // Error state
  if (error || !club) {
    return (
      <div className={styles.pageContainer}>
        <p>{error || 'Organization not found.'}</p>
      </div>
    );
  }

  // Upcoming events returned by the organization endpoint
  const upcomingEvents = club.events || [];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>

        {/* Club Header Card */}
        <header className={styles.headerCard}>
          <div className={styles.clubIdentity}>
            <div className={styles.clubAvatar}>
              {/* Display the organization logo or fallback initials */}
              {club.image ? (
                <img
                  src={club.image}
                  alt={`${club.name} logo`}
                  className={styles.clubLogo}
                />
              ) : (
                club.name.slice(0, 2).toUpperCase()
              )}
            </div>

            <div>
              <div className={styles.badgeRow}>
                {club.category && (
                  <span className={styles.categoryBadge}>
                    {club.category}
                  </span>
                )}

                {/* Only display the admin badge to organization admins */}
                {isOwner && (
                  <span className={styles.ownerBadge}>
                    Admin View
                  </span>
                )}
              </div>

              <h1 className={styles.clubName}>{club.name}</h1>
            </div>
          </div>

          <div className={styles.headerActions}>
            {/* TODO: Connect Post Event functionality for organization admins */}

            {/* Only organization administrators can edit club information */}
            {isOwner && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleToggleEdit}
                disabled={savingEdit}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Club'}
              </button>
            )}
            
            {/* Only organization admins can view the member list */}
            {isOwner && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleViewMembers}
                disabled={loadingMembers}
              >
                {loadingMembers
                  ? 'Loading...'
                  : showMembers
                    ? 'Hide Members'
                    : 'View Members'}
              </button>
            )}

            {/* Following is available to both students and admins */}
            <button
              type="button"
              className={
                isFollowing
                  ? styles.followingBtn
                  : styles.primaryBtn
              }
              onClick={handleFollow}
              disabled={updatingFollow}
            >
              {updatingFollow
                ? 'Updating...'
                : isFollowing
                  ? 'Following ✓'
                  : 'Follow'}
            </button>
          </div>

          {actionError && <p role="alert">{actionError}</p>}
        </header>

        {/* About Section (Editable for Owners) */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>About</h2>

          {isOwner && isEditing ? (
            <form onSubmit={handleSaveEdit} className={styles.editForm}>

              {/* Organization name */}
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>
                  Organization Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: e.target.value
                    }))
                  }
                  className={styles.input}
                  disabled={savingEdit}
                />
              </div>

              {/* Organization image URL (optional) */}
              <div className={styles.fieldGroup}>
                <label htmlFor="image" className={styles.label}>
                  Image URL
                </label>
                <input
                  id="image"
                  type="url"
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      image: e.target.value
                    }))
                  }
                  className={styles.input}
                  disabled={savingEdit}
                />
              </div>

              {/* Organization description */}
              <div className={styles.fieldGroup}>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows="4"
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  className={styles.textarea}
                  disabled={savingEdit}
                />
              </div>

              {/* Display backend validation or request errors */}
              {editError && <p role="alert">{editError}</p>}

              <div className={styles.editActions}>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={savingEdit}
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <p className={styles.description}>
              {club.description}
            </p>
          )}
        </section>
        
        {/* Organization Members Section (Admins Only) */}
        {isOwner && showMembers && (
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Members</h2>

              {!loadingMembers && !membersError && (
                <span className={styles.eventCountTag}>
                  {members.length} members
                </span>
              )}
            </div>

            {loadingMembers && <p>Loading members...</p>}

            {membersError && <p role="alert">{membersError}</p>}

            {!loadingMembers && !membersError && (
              members.length === 0 ? (
                <p className={styles.emptyText}>
                  No members yet.
                </p>
              ) : (
                <div className={styles.eventsList}>
                  {members.map((name, index) => (
                    <div
                      key={`${name}-${index}`}
                      className={styles.eventItem}
                    >
                      <h3 className={styles.eventTitle}>
                        {name}
                      </h3>
                    </div>
                  ))}
                </div>
              )
            )}
          </section>
        )}

        {/* Upcoming Events Section */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Upcoming Events
            </h2>

            {/* Display the active event count to organization admins */}
            {isOwner && (
              <span className={styles.eventCountTag}>
                {upcomingEvents.filter(
                  (event) => event.status === 'active'
                ).length} active
              </span>
            )}
          </div>

          {upcomingEvents.length === 0 ? (
            <p className={styles.emptyText}>
              No upcoming events scheduled yet.
            </p>
          ) : (
            <div className={styles.eventsList}>
              {upcomingEvents.map((event) => (
                <div key={event.id} className={styles.eventItem}>
                  <div>
                    <h3 className={styles.eventTitle}>
                      {event.title}
                    </h3>

                    <p className={styles.eventMeta}>
                      {new Date(event.date).toLocaleString()}

                      {event.location && ` • ${event.location}`}

                      {event.status === 'cancelled' && ' • Cancelled'}
                    </p>
                  </div>

                  <div className={styles.eventActions}>
                    {/* Only organization admins can access the attendees list */}
                    {isOwner && (
                      <Link
                        to={`/events/${event.id}/eventattendees`}
                        state={{ isOwner }}
                        className={styles.attendeesBtn}
                      >
                        Attendees
                      </Link>
                    )}

                    <Link
                      to={`/events/${event.id}`}
                      className={styles.viewEventBtn}
                    >
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