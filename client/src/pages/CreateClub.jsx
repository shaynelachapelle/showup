// Author: Rachel Ha
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../css/CreateClub.module.css";
import { api } from "../api/client";

const CATEGORIES = [
  "Athletics and Recreation",
  "Charity and Environment",
  "Community Outreach and Volunteering",
  "Fine Arts, Dance and Performance",
  "Health and Wellness",
  "Language and Publications",
  "Leisure and Hobbies",
  "Networking and Leadership",
  "Political and Social Activism",
  "Religion and Culture"
];

export default function CreateClub() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: CATEGORIES[0],
    image: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setImageError(false);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      setError("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        ...(formData.image.trim() ? { image: formData.image.trim() } : {})
      };

      const res = await api.post("/api/orgs", payload);

      if (res?.organizationId) {
        navigate(`/organization/${res.organizationId}`);
      } else {
        navigate("/myorgs");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not create club. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.topBar}>
          <Link to="/allevents" className={styles.backLink}>
            ← Back to Events &amp; Clubs
          </Link>
        </div>

        <div className={styles.formCard}>
          <header className={styles.header}>
            <span className={styles.badge}>Student Organizations</span>
            <h1 className={styles.title}>Create a Club</h1>
            <p className={styles.subtitle}>
              Start a new club page on Showup to share your group and host campus events.
            </p>
          </header>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Club Name */}
            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>
                Club Name <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g., McGill Hiking & Outdoors Club"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Category */}
            <div className={styles.fieldGroup}>
              <label htmlFor="category" className={styles.label}>
                Category <span className={styles.required}>*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className={styles.fieldGroup}>
              <label htmlFor="description" className={styles.label}>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                placeholder="Tell students what your club is about, what events you host, and how to get involved..."
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>

            {/* Optional Image URL */}
            <div className={styles.fieldGroup}>
              <label htmlFor="image" className={styles.label}>
                Club Logo / Banner Image URL <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/club-logo.png"
                value={formData.image}
                onChange={handleChange}
                className={styles.input}
              />
              {formData.image.trim() && !imageError && (
                <div className={styles.previewBox}>
                  <img
                    src={formData.image.trim()}
                    alt="Club preview"
                    className={styles.previewImg}
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
            </div>

            {/* Submit & Cancel Actions */}
            <div className={styles.actions}>
              <Link to="/allevents" className={styles.cancelBtn}>
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className={styles.submitBtn}
              >
                {submitting ? "Creating Club..." : "Create Club"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}