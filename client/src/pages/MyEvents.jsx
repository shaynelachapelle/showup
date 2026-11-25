// Author: Grace Yuzwin

// Css styles
import styles from "../css/MyEvents.module.css";

// other components
import EventColumn from "../components/EventColumn";

// functions that sort events into the day categories
import { getEventCategory } from "../helper-functions/dates";

// for api
import { useEffect, useState } from "react";
import {api} from "../api/client"


function MyEvents() {
    // GET call
    const [events, setEvents] = useState([]);

    useEffect (() => {

        async function loadEvents() {

            try {
                // Start by using 100 as a limit, if we see fit, will use pagnation
                const data = await api.get(
                    "/api/events/my-orgs?limit=100"
                );

                setEvents(data);
            } catch (err) {
                console.error(err);
            }

        }
        loadEvents();
    }
    , []);

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