// Author: Grace Yuzwin

// css styling
import styles from "../css/CalendarButton.module.css"

// state
import { useState } from "react";

function CalendarButton() {
    const [open, setOpen] = useState(false);

    {/* TO BE IMPLEMENTED */}
    const addToGoogleCalendar = () => {
        
    };
    {/* TO BE IMPLEMENTED */}
    const downloadICS = () => {
        
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