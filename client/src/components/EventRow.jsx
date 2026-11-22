// Author: Grace Yuzwin

// link import
import { Link } from "react-router-dom";

// css styling
import styles from "../css/EventRow.module.css"

// components
import EventCard from "./EventCard"
import SeeMoreCard from "./SeeMoreCard";

function EventRow({ title, events, linkTo, emptyMessage, moreMessage }) {
    
    // if there are no events passed, send the proper message
    if (events.length === 0) {
        return (
            <div className={styles.eventRow}>
                <div className={styles.header}>
                    <div className={styles.title}>{title}</div>

                    <Link to={linkTo} className={styles.seeMore}>
                        See All →
                    </Link>
                </div>

                <div className={styles.emptyState}>
                    {emptyMessage}
                </div>
            </div>
        );
    }
    
    // if there are events to display, display them
    return <div className={styles.eventRow}>
        {/* title for the row below */}
        <div className={styles.header}>
            <div className={styles.title}>{title}</div>

            <Link to={linkTo} className={styles.seeMore}>
                See All →
            </Link>
        </div>

        {/* map the passed events to event cards */}
        <div className={styles.eventRowCards}>
            {events.map((event) => (
            <EventCard 
                key={event.id}
                id={event.id}
                organizationId={event.organizationId}
                title={event.title} 
                date={event.date}
                organization={event.organization}
                image={event.image}
                cost={event.cost}
                can_rsvp={event.can_rsvp}
                isRsvped={event.isRsvped}
            />
            ))}
        <SeeMoreCard to={linkTo} moreMessage={moreMessage} />
        </div>
    </div>
}

export default EventRow;