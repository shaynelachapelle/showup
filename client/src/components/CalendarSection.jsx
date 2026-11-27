// Author: Grace Yuzwin

// css styling
import styles from "../css/CalendarSection.module.css"

function CalendarSection() {
    {/* TO BE IMPLEMENTED */}
    const addToGoogleCalendar = () => {
        
    };
    {/* TO BE IMPLEMENTED */}
    const copyLink = () => {
        
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Calendar sync</div>

            <div className={styles.text}>
                Subscribe once and new events from your clubs show up in your calendar automatically.
            </div>

            <div className={styles.subheading}>
                Your feed URL
            </div>

            <div className={styles.copyRow}>
                <input type="text" className={styles.link}></input>

                <button className={styles.copyButton} onClick={copyLink}>
                    Copy
                </button>
            </div>

            <button className={styles.addButton} onClick={addToGoogleCalendar}>
                Add to Google Calendar
            </button>

        </div>
    );
}

export default CalendarSection;