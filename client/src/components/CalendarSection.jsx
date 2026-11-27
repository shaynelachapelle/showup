// Author: Grace Yuzwin, Shayne Lachapelle

// css styling
import styles from "../css/CalendarSection.module.css"

// helper functions
import { downloadIcs } from "../helper-functions/calendar";

function CalendarSection() {
    const downloadMyEvents = async () => {
        try {
            await downloadIcs("/api/calendar.ics", "showup-my-events.ics");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Export to calendar</div>

            <div className={styles.text}>
                Download your upcoming RSVPs as an .ics file and import it into Google Calendar, Apple Calendar or Outlook.
            </div>

            <button className={styles.addButton} onClick={downloadMyEvents}>
                Download my RSVPs (.ics)
            </button>

        </div>
    );
}

export default CalendarSection;
