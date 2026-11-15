import styles from "../css/EventRow.module.css"
import EventCard from "./EventCard"

function EventRow({title, events}) {
    return <div className={styles.eventRow}>
        <h1>{title}</h1>

        <div className={styles.eventRowCards}>

            {events.map((event) => (
            <EventCard 
                title={event.title} 
                date={event.date}
                organization={event.organization}
                cost={event.cost}
                can_rsvp={event.can_rsvp}
                image={event.image}
            />
        )
        )}
        </div>
    </div>
}

export default EventRow;