// Author: Grace Yuzwin

// css styles
import styles from "../css/EventColumn.module.css"

// other components
import EventCard from "../components/Long-EventCard"

function EventColumn({ heading, events, emptyMessage}) {
    
    // if there are no events for this column, show message
    if (events.length === 0) {
        return (
            <div>
                <div className={styles.heading}>{heading}</div>
                <div className={styles.message}>{emptyMessage}</div>
            </div>
        );
    }
    
    // if there are events, display them
    return (
    <div>
        {/* title of the row */}
        <div className={styles.heading}>{heading}</div>

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
                eventStatus={event.status}
            />
        ))} 
        </div>

    </div>

    );
}

export default EventColumn;