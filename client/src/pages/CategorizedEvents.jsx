// Author: Grace Yuzwin

// router imports
import { Link, useParams, Navigate } from "react-router-dom";

// css styling
import styles from "../css/CategorizedEvents.module.css"

//components
import EventCard from "../components/EventCard.jsx"


function CategorizedEvents() {
    // get the requested category
    const { category } = useParams();

    // tranform into passable parameter
    const formatted = category.replace(/\+/g, " ")

    // Have an error check for is the parameter passed is valid
    const isValid = true;

    // if the parameter passed is not valid, redirect to the all events page
    if (!isValid) {
        return <Navigate to="/home" replace />
    }


    
    // GET call
    const allEvents = []

    const events =  allEvents.filter(
        event => (event.category === formatted)
    );


    // above is replaced

    // if we get no events in a category
    if (events.length === 0) {
        return(
            
            <div className={styles.page}>
                <Link to="/allevents" className={styles.link}>Back to all events...</Link>

                <div className={styles.heading}>{formatted}</div>
                <div className={styles.noEvents}>Sorry, there are no upcoming events in this category</div>
                <Link to="/allevents" className={styles.moreEvents}>Check out some other upcoming events here!</Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>

            {/* headings and grid */}
            <div className={styles.content}>
                {/* link to go back */}
                <Link to="/allevents" className={styles.link}>Back to all events...</Link>

                {/* headings */}
                <div className={styles.subheading}>Here you can find all events related to:</div>

                <div className={styles.heading}>{formatted}</div>

                {/* grid of events */}
                <div className={styles.events}>
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
                </div>
            </div>
        </div>
    );

}
export default CategorizedEvents;