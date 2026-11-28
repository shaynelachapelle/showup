// Author: Rachel Ha, Adam Ahmed
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import styles from '../css/PostEvent.module.css';

const INITIAL_FORM = {
  title: '',
  date: '',
  time: '',
  endDate: '',
  endTime: '',
  location: '',
  cost: '0',
  capacity: '',
  imageUrl: '',
  description: ''
};

function formatPreviewDate(dateStr, timeStr) {
  if (!dateStr && !timeStr) return 'Date & time TBA';

  let formattedDate = '';
  if (dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  let formattedTime = '';
  if (timeStr) {
    const [hourStr, minute] = timeStr.split(':');
    const hour = Number(hourStr);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    formattedTime = `${hour12}:${minute} ${period}`;
  }

  return [formattedDate, formattedTime].filter(Boolean).join(' • ');
}

export default function PostEvent() {
  const { organizationId } = useParams();

  // Event form and submission state
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [createdEventId, setCreatedEventId] = useState(null);

  // Organization information and admin permissions
  const [organization, setOrganization] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Loading, submission and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Retrieve the hosting organization and verify admin permissions
  useEffect(() => {
    let ignore = false;

    async function loadOrganization() {
      setLoading(true);
      setError('');
      setOrganization(null);
      setIsOwner(false);

      // Reset the form when navigating to another organization
      setFormData(INITIAL_FORM);
      setSubmitted(false);
      setCreatedEventId(null);
      setSubmitError('');

      try {
        const [orgData, administeredOrgs] = await Promise.all([
          api.get(`/api/orgs/${organizationId}`),
          api.get('/api/orgs/administered')
        ]);

        if (ignore) return;

        setOrganization(orgData);

        // Check whether the user administers this specific organization
        setIsOwner(
          administeredOrgs.some((org) => org.id === organizationId)
        );
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOrganization();

    return () => {
      ignore = true;
    };
  }, [organizationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and publish the event through the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOwner || submitting) return;

    setSubmitError('');
    setSubmitting(true);

    try {
      // Convert the selected start date and time to ISO format
      const start = new Date(`${formData.date}T${formData.time}`);

      if (Number.isNaN(start.getTime())) {
        throw new Error('Please enter a valid start date and time.');
      }

      // Prepare the event information required by the API
      const eventData = {
        orgId: organizationId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: start.toISOString(),
        location: formData.location.trim(),
        cost: Number(formData.cost),
        capacity: formData.capacity.trim() === ''
          ? null
          : Number(formData.capacity),
        image: formData.imageUrl.trim() || null
      };

      // Validate the event cost
      if (!Number.isFinite(eventData.cost) || eventData.cost < 0) {
        throw new Error('Cost must be a non-negative number.');
      }

      // Validate the optional capacity
      if (
        eventData.capacity !== null &&
        (!Number.isSafeInteger(eventData.capacity) ||
          eventData.capacity <= 0)
      ) {
        throw new Error('Capacity must be a positive whole number.');
      }

      // Include an end date and time if provided
      if (formData.endDate || formData.endTime) {
        if (!formData.endDate || !formData.endTime) {
          throw new Error('Please provide both an end date and time.');
        }

        const end = new Date(
          `${formData.endDate}T${formData.endTime}`
        );

        if (Number.isNaN(end.getTime()) || end <= start) {
          throw new Error('End time must be after the start time.');
        }

        eventData.end = end.toISOString();
      }

      // Create the event in MongoDB through the API
      const result = await api.post('/api/events', eventData);

      setCreatedEventId(result.eventId);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset the form to allow another event to be created
  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSubmitted(false);
    setCreatedEventId(null);
    setSubmitError('');
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <p>Loading organization...</p>
      </div>
    );
  }

  // Organization retrieval error
  if (error) {
    return (
      <div className={styles.pageContainer}>
        <p>{error}</p>
        <Link to="/myorgs">Back to My Organizations</Link>
      </div>
    );
  }

  // Prevent non-admins from accessing the event creation form
  if (!isOwner) {
    return (
      <div className={styles.pageContainer}>
        <p>Only organization administrators can post events.</p>
        <Link to={`/organization/${organizationId}`}>
          Back to Organization
        </Link>
      </div>
    );
  }

  // Display confirmation after successfully publishing an event
  if (submitted) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>

          <h1 className={styles.successTitle}>
            Event <span className={styles.highlight}>Published</span>
          </h1>

          <p className={styles.successSubtitle}>
            <strong>{formData.title}</strong> hosted by{' '}
            {organization.name} is now live on Showup.
          </p>

          <div className={styles.successActions}>
            <Link
              to={`/events/${createdEventId}`}
              className={styles.submitBtn}
            >
              View Event
            </Link>

            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleReset}
            >
              Post Another Event
            </button>

            <Link
              to={`/organization/${organizationId}`}
              className={styles.clearBtn}
            >
              Back to Organization
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            Post an <span className={styles.highlight}>Event</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Create a listing for your club and preview how it will appear to McGill students.
          </p>
        </header>

        <div className={styles.layoutGrid}>
          {/* Left Column: Form */}
          <form onSubmit={handleSubmit} className={styles.formCard}>
            {/* Section 1: Basics */}
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>Event Details</h2>

              <div className={styles.fieldGroup}>
                <label htmlFor="title" className={styles.label}>Event Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g., Winter Technical Interview Workshop"
                  value={formData.title}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Display the organization hosting this event */}
              <div className={styles.fieldGroup}>
                <label htmlFor="organization" className={styles.label}>
                  Hosting Club
                </label>

                <input
                  id="organization"
                  type="text"
                  value={organization.name}
                  readOnly
                  className={styles.input}
                />
              </div>
            </div>

            {/* Section 2: Date, Time & Location */}
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>When &amp; Where</h2>

              <div className={styles.twoColRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="date" className={styles.label}>Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="time" className={styles.label}>Start Time</label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Optional event end date and time */}
              <div className={styles.twoColRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="endDate" className={styles.label}>
                    End Date <span className={styles.optionalTag}>(Optional)</span>
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="endTime" className={styles.label}>
                    End Time <span className={styles.optionalTag}>(Optional)</span>
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="location" className={styles.label}>Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  placeholder="e.g., Trottier 3120 or SSMU Ballroom"
                  value={formData.location}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Event cost and capacity */}
              <div className={styles.twoColRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="cost" className={styles.label}>
                    Cost ($)
                  </label>
                  <input
                    id="cost"
                    name="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="capacity" className={styles.label}>
                    Capacity <span className={styles.optionalTag}>(Optional)</span>
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Unlimited"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Media & Description */}
            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>Extras &amp; Description</h2>

              <div className={styles.fieldGroup}>
                <label htmlFor="imageUrl" className={styles.label}>
                  Cover Image URL <span className={styles.optionalTag}>(Optional)</span>
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/event-poster.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="description" className={styles.label}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  placeholder="What should students know? Mention free food, RSVP limits, or what to bring..."
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              </div>
            </div>

            {/* Display any event submission errors */}
            {submitError && (
              <p role="alert" style={{ color: 'red' }}>
                {submitError}
              </p>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleReset}
                disabled={submitting}
              >
                Clear
              </button>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>
          </form>

          {/* Right Column: Live Preview */}
          <aside className={styles.previewColumn}>
            <span className={styles.previewLabel}>Live Card Preview</span>

            <div className={styles.previewCard}>
              <div className={styles.previewBanner}>
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Event cover preview"
                    className={styles.previewBannerImg}
                  />
                ) : (
                  <div className={styles.previewBannerFallback}>
                    <span>Showup</span>
                  </div>
                )}
              </div>

              <div className={styles.previewBody}>
                <p className={styles.previewOrg}>{organization.name}</p>
                <h3 className={styles.previewTitle}>
                  {formData.title.trim() || 'Your Event Title'}
                </h3>

                <div className={styles.previewMetaList}>
                  <div className={styles.previewMetaRow}>
                    <span className={styles.metaDot} />
                    <span>{formatPreviewDate(formData.date, formData.time)}</span>
                  </div>
                  <div className={styles.previewMetaRow}>
                    <span className={styles.metaDot} />
                    <span>{formData.location.trim() || 'Campus location TBA'}</span>
                  </div>
                </div>

                <p className={styles.previewDescription}>
                  {formData.description.trim() ||
                    'Your event description will appear here so students know what to expect.'}
                </p>

                <div className={styles.previewFooter}>
                  <span className={styles.previewRsvpBadge}>RSVP Open</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}