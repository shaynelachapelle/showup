// Author: Grace Yuzwin

// Css styles
import styles from "../css/MyEvents.module.css"

// other components
import EventColumn from "../components/EventColumn"

// functions that sort events into the day categories
import { getEventCategory } from "../helper-functions/dates"


function MyEvents() {

    // to be replaced with a GET
    const events = []

    // sort the events into today, this week, and later
    const todayEvents = events.filter(
        event => getEventCategory(event.date) === "today"
        );

        const thisWeekEvents = events.filter(
        event => getEventCategory(event.date) === "thisWeek"
        );

        const laterEvents = events.filter(
        event => getEventCategory(event.date) === "later"
    );

    return (
        <div className={styles.pageContainer}>
            {/* heading */}
            <div className={styles.title}>My events</div>
            <div className={styles.subtitle}>Events from the organizations you follow and everything you've RSVP'd to.</div>

            <div className={styles.container}>
                <div className={styles.item}>
                    <EventColumn heading="TODAY" events={todayEvents} emptyMessage="No events today!"/>
                </div>
                <div className={styles.item}>
                    <EventColumn heading="THIS WEEK" events={thisWeekEvents} emptyMessage="No more events this week!"/>
                </div>
                <div className={styles.item}>
                    <EventColumn heading="LATER" events={laterEvents} emptyMessage="No more events!"/>
                </div>
            </div>
        </div>
    );
}

export default MyEvents;