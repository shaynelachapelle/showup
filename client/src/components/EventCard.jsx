// Author: Grace Yuzwin
import styles from "../css/EventCard.module.css"
import RsvpButton from "./RsvpButton"
import { Link } from "react-router-dom";

function EventCard({id, organizationId, title, date, organization, cost, image, can_rsvp, isRsvped}) {
    
    // compute the status for button appearance
    let status = "rsvp";

    if (isRsvped) {
        status = "going";
    }
    else if (!can_rsvp) {
        status = "full";
    }


    /* display those constants */
    return <div className={styles.eventCard}>
        {/* the image is a link to that event page */}
        <Link to={`/events/${id}`} className={styles.eventImage}>
            <img src={image} alt={title}></img>
        </Link>

        <div className={styles.eventOverlay}>
            <RsvpButton 
                variant="card" 
                status={status}
                onClick={() => handleRsvp(id)}
            />
        </div>

        <div className={styles.eventInfo}>
            {/* the event name is a link to that event page */}
            <Link to={`/events/${id}`} className={styles.title}>{title}</Link>

            {/* the organization name is a link to that organization page */}
            <Link to={`/organization/${organizationId}`} className={styles.organization}>hosted by {organization}</Link>

            {/* no links for the date and cost */}
            <p>Date: {date}</p>
            <p>Cost: {cost}</p>
            
        </div>
    </div>
}

export default EventCard
