// Author: Grace Yuzwin

// css styling
import styles from "../css/EventCard.module.css"

// components
import RsvpButton from "./RsvpButton"

//helper functions
import { getFormattedDate } from "../helper-functions/dates"

// other needed imports
import { Link } from "react-router-dom";

// stock image import
import stock from "../assets/no-image.webp"

function EventCard({id, organizationId, title, date, organization, cost, image, can_rsvp, isRsvped}) {

    // if there is no image, use the stock image
    if (image === null) {
        image = stock;
    }

    // if the cost is 0, say free
    const strCost =
        cost === 0
            ? "Free!"
            : "$" + cost.toString();

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
            <p>Date: {getFormattedDate(date)}</p>
            <p>Cost: {strCost}</p>
            
        </div>
    </div>
}

export default EventCard
