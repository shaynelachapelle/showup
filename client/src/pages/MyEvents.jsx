// Author: Grace Yuzwin

// Css styles
import styles from "../css/MyEvents.module.css";

// other components
import EventColumn from "../components/EventColumn";
import CalendarSection from "../components/CalendarSection"

// functions that sort events into the day categories
import { getEventCategory } from "../helper-functions/dates";

// for api
import { useEffect, useState } from "react";
import {api} from "../api/client"


function MyEvents() {
    // states for event loading
    const [filter, setFilter] = useState("All");

    // GET call
    const [events, setEvents] = useState([]);

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

    useEffect (() => {
        loadEvents();
    }
    , [filter]);

    // default use all events
    let todayEvents = events.filter(
        event => getEventCategory(event.date) === "today"
    );

    let thisWeekEvents = events.filter(
        event => getEventCategory(event.date) === "thisWeek"
    );

    let laterEvents = events.filter(
        event => getEventCategory(event.date) === "later"
    );

    // check filter to see if we want only RSVP'd events that are not cancelled
    if (filter === "RSVP") {

        todayEvents = todayEvents.filter(
            event => (event.isRsvped && (event.status !== "cancelled"))
        );

        thisWeekEvents = thisWeekEvents.filter(
            event => (event.isRsvped && (event.status !== "cancelled"))
        );

        laterEvents = laterEvents.filter(
            event => (event.isRsvped && (event.status !== "cancelled"))
        );
    // then all not RSVP'd
    } else if ((filter === "not RSVP")) {
        todayEvents = todayEvents.filter(
            event => (!(event.isRsvped) && event.can_rsvp)
        );

        thisWeekEvents = thisWeekEvents.filter(
            event => (!(event.isRsvped) && event.can_rsvp) 
        );

        laterEvents = laterEvents.filter(
            event => (!(event.isRsvped) && event.can_rsvp) 
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* heading */}
            <div className={styles.title}>My events</div>
            <div className={styles.subtitle}>Events from the organizations you follow and everything you've RSVP'd to.</div>
            
            <div className={styles.calendarContainer}>
                <CalendarSection />

                <div className={styles.eventContainer}>
                    <div className={styles.buttonRow}>
                        <div className={styles.buttonTag}>Filters:</div>
                        <button 
                            className={`${styles.button} ${
                                filter === "All" ? styles.active : ""
                            }`}
                            onClick={() => setFilter("All")}
                        >
                            All
                        </button>
                        <button 
                            className={`${styles.button} ${
                                filter === "RSVP" ? styles.active : ""
                            }`}
                            onClick={() => setFilter("RSVP")}
                        >
                            Going
                        </button>
                        <button 
                            className={`${styles.button} ${
                                filter === "not RSVP" ? styles.active : ""
                            }`}
                            onClick={() => setFilter("not RSVP")}
                        >
                            Can RSVP
                        </button>
                    </div>
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
        </div>
    );
}

export default MyEvents;