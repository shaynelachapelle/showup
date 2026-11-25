// Author: Rachel Ha
import { useState } from 'react';
import styles from '../css/PostEvent.module.css';

const ORGANIZATIONS = [
  "Computer Science Undergraduate Society (CSUS)",
  "DriveSafe",
  "McGill Esports",
  "McGill Students' Culinary Society",
  "Canadian Asian Society"
];

const CATEGORIES = [
  "Academic",
  "Social",
  "Workshop",
  "Networking",
  "Sports & Wellness",
  "Other"
];

const INITIAL_FORM = {
  title: '',
  organization: ORGANIZATIONS[0],
  category: CATEGORIES[0],
  date: '',
  time: '',
  location: '',
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
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST formData to your Node/MongoDB backend with fetch()
    console.log('New event posted:', formData);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>
            Event <span className={styles.highlight}>Published</span>
          </h1>
          <p className={styles.successSubtitle}>
            <strong>{formData.title}</strong> hosted by {formData.organization} is now live on Showup.
          </p>
          <div className={styles.successActions}>
            <button type="button" className={styles.submitBtn} onClick={handleReset}>
              Post Another Event
            </button>
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

              <div className={styles.fieldGroup}>
                <label htmlFor="organization" className={styles.label}>Hosting Club</label>
                <select
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className={styles.input}
                >
                  {ORGANIZATIONS.map((org) => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.label}>Category</span>
                <div className={styles.pillGroup}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                      className={
                        formData.category === cat
                          ? `${styles.categoryPill} ${styles.categoryPillActive}`
                          : styles.categoryPill
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
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

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => setFormData(INITIAL_FORM)}
              >
                Clear
              </button>
              <button type="submit" className={styles.submitBtn}>
                Publish Event
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
                <span className={styles.previewCategoryBadge}>{formData.category}</span>
              </div>

              <div className={styles.previewBody}>
                <p className={styles.previewOrg}>{formData.organization}</p>
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