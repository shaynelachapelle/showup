// Author: Grace Yuzwin

// The netflix-like event row
import styles from "../css/EventRow.module.css"
import EventCard from "./EventCard"

function EventRow({title, events}) {
    return <div className={styles.eventRow}>
        {/* title for the row below */}
        <h1>{title}</h1>

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
        )
        )}
        </div>
    </div>
}

export default EventRow;