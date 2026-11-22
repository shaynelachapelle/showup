// Author: Grace Yuzwin

// other components
import RsvpButton from "../components/RsvpButton"
import DateBadge from "../components/DateBadge"

// css styling
import styles from "../css/Long-EventCard.module.css"

// routing
import { Link } from "react-router-dom";

// function to get the time of event
import { getFormattedTime } from "../helper-functions/dates"


function EventCard ( { id, organizationId, title, date, organization, cost, can_rsvp, isRsvped} ) {
    
    // compute the status for button appearance
    let status = "rsvp";

    if (isRsvped) {
        status = "going";
    }
    else if (!can_rsvp) {
        status = "full";
    }

    // if the cost is 0, say free
    const strCost =
    cost === 0
        ? "Free!"
        : "$" + cost.toString();

    return (
        <div className={styles.section}>

            {/* actual event card */}
            <div className={styles.card}>

                <DateBadge date={date}/>

                {/* title and event info div */}
                <div>
                    {/* link to the event */}
                    <Link to={`/events/${id}`} className={styles.cardTitle}>{title}</Link>
                    {/* subheading div, which has a link to the organization */}
                    <div className={styles.cardSubtitle}>
                        <Link to={`/organization/${organizationId}`} className={styles.cardSubtitleOrg}>{organization}</Link> • {getFormattedTime(date)} • {strCost}</div>
                </div>
                
                {/* RSVP button and put it on RHS */}
                <div className={styles.Rsvp}> 
                    <RsvpButton 
                        variant="page" 
                        status={status}
                        onClick={() => handleRsvp(id)}
                    />
                </div>

            </div>
        </div>
    );
}

export default EventCard;