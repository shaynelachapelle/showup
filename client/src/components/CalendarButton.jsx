// Author: Grace Yuzwin, Shayne Lachapelle

// css styling
import styles from "../css/CalendarButton.module.css"

// state
import { useState } from "react";

// helper functions
import { downloadIcs } from "../helper-functions/calendar";

function CalendarButton({ eventId }) {
    const [open, setOpen] = useState(false);

    // The server redirects to a pre-filled Google Calendar event.
    const addToGoogleCalendar = () => {
        setOpen(false);
        window.open(`/api/events/${eventId}/google-calendar`, "_blank", "noopener");
    };

    const downloadICS = async () => {
        setOpen(false);
        try {
            await downloadIcs(`/api/events/${eventId}/calendar.ics`, "showup-event.ics");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <button
                className={styles.main}
                onClick={() => setOpen(!open)}
            >
                Add to Calendar ▼
            </button>

            {open && (
                <div className={styles.menu}>
                    <button className={styles.menuButton} onClick={addToGoogleCalendar}>
                        Add to Google Calendar
                    </button>

                    <button className={styles.menuButton} onClick={downloadICS}>
                        Download .ics
                    </button>
                </div>
            )}
        </div>
    );
}

export default CalendarButton;
