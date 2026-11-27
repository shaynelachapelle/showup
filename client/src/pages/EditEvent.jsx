// Author: Grace Yuzwin, Rachel Ha

// NOTE:
    // most of the form code is copied from PostEvent.jsx (Rachel's code), but 
    // adjusted for editting events (Grace's code)

// css styling
import styles from "../css/EditEvent.module.css"

// for api
import { useEffect, useState } from "react";
import { api } from "../api/client"

// needed router imports
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";


function EditEvent() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [originalForm, setOriginalForm] = useState(null);
    const [formData, setFormData] = useState(null);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check that the cost and capacity are valid
        if (Number(formData.cost) < 0) {
            alert("Cost cannot be negative.");
            return;
        }

        if (
            formData.capacity !== "" &&
            Number(formData.capacity) < 1
        ) {
            alert("Capacity must be at least 1.");
            return;
        }

        // confirm window
        const confirmed = window.confirm(
            "Save changes to this event?"
        );

        if (!confirmed) {
            return;
        }

        // check that it has changed
        const hasChanges =
            JSON.stringify(formData)
            !==
            JSON.stringify(originalForm);
        
        if (!hasChanges) {
            alert(
                err?.response?.data?.message ??
                err.message ??
                "Failed to update event."
            );
            return;
        } 

        // build the payload
        const payload = {
            title: formData.title,

            description: formData.description,

            date: new Date(
                `${formData.date}T${formData.time}`
            ).toISOString(),

            cost: parseFloat(formData.cost),

            location: formData.location,

            capacity:
                formData.capacity === ""
                    ? null
                    : parseInt(formData.capacity, 10),

            image: formData.imageUrl
        };

        try {
            // API call
            await api.patch(
                `/api/events/${id}`,
                payload
            );
            // navigate back to the event page
            navigate(`/events/${id}`);

        } catch (err) {
            // if there is an error, log it and alert it
            console.error(err);
            alert(err.message);

        }

    };

    function handleRevert() {
        setFormData({ ...originalForm });
    }

    // GET event and org admins
    const [notFound, setNotFound] = useState(false);
    const [adminOrganizations, setAdminOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPage() {
            try {
                const [eventData, adminData] = await Promise.all([
                    api.get(`/api/events/${id}`),
                    api.get("/api/orgs/administered")
                ]);

                // we now have the event data
                const initialForm = {
                    title: eventData.title,
                    organizationId: eventData.organizationId,
                    category: eventData.category,
                    capacity: eventData.capacity ?? "",
                    cost: eventData.cost,
                    date: eventData.date.slice(0, 10),
                    time: eventData.date.slice(11, 16),
                    location: eventData.location,
                    imageUrl: eventData.image ?? "",
                    description: eventData.description,
                    organizationName: eventData.organizationName
                };

                // set the form data, initially, it will the the initial data from the event
                setOriginalForm(initialForm);
                setFormData(initialForm);
                // set the admin data
                setAdminOrganizations(adminData);

            } catch (err) {
                console.error(err);
                setNotFound(true);

            } finally {
                setLoading(false);
            }
        }

        loadPage();
    }, [id]);


    // if we are loading, return loading
    if (loading) {
    return <div>Loading...</div>;
    }
    // ensure there is form data before continuing
    if (!formData) {
    return <div>Loading...</div>;
}

    // if the event is not found, go to home
    if (notFound) {
        return <Navigate to="/home" replace />;
    }

    // check if the user is an admin of the org
    const isAdmin = adminOrganizations.some(
        org => org.id === formData.organizationId
    );
    // if the user is not an admin of the org, go to home
    if (!isAdmin) {
        return <Navigate to="/home" replace />;
    }


    return (
        <div className={styles.pageContainer}>
            <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => navigate(`/events/${id}`)}
            >
                ✖
            </button>
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
                        <input
                            value={formData.organizationName}
                            disabled
                            className={`${styles.input} ${styles.noSelect}`}
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

            
                {/* Section 4: Media & Description */}
                <div className={styles.sectionBlock}>
                    <h2 className={styles.sectionHeading}>Extras &amp; Description</h2>

                    <div className={styles.twoColRow}>
                        <div className={styles.fieldGroup}>
                            <label htmlFor="cost" className={styles.label}>Cost</label>
                            <div className={styles.moneyInput}>
                                <span>$</span>
                                <input
                                    id="cost"
                                    name="cost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="ex. 15.50"
                                    required
                                    value={formData.cost}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                        </div>
            
                        <div className={styles.fieldGroup}>
                              <label htmlFor="capacity" className={styles.label}>
                                Capacity <span className={styles.optionalTag}>(Optional: Defaults to unlimited)</span>
                            </label>
                              <input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="1"
                                placeholder="ex. 20"
                                value={formData.capacity}
                                onChange={handleChange}
                                className={styles.input}
                              />
                        </div>
                    </div>
            
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
                        onClick={handleRevert}
                    >
                        Revert Changes
                    </button>
                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                    >
                        Save Changes
                    </button>
                </div> 
            </form>
        </div>
    );
}

export default EditEvent;