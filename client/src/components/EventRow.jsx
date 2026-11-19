// Author: Grace Yuzwin
import { Link } from "react-router-dom";
import SeeMoreCard from "./SeeMoreCard";

// The netflix-like event row
import styles from "../css/EventRow.module.css"
import EventCard from "./EventCard"

function EventRow({title, events, linkTo}) {
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
        <SeeMoreCard to={linkTo} />
        </div>
    </div>
}

export default EventRow;