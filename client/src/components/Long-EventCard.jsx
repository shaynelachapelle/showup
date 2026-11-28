// Author: Grace Yuzwin, Shayne Lachapelle

// other components
import RsvpButton from "../components/RsvpButton"
import DateBadge from "../components/DateBadge"

// css styling
import styles from "../css/Long-EventCard.module.css"

// routing
import { Link, useNavigate } from "react-router-dom";

// function to get the time of event
import { getFormattedTime } from "../helper-functions/dates"
import { useRsvp } from "../helper-functions/rsvp"


function EventCard ( { id, organizationId, title, date, organization, cost, can_rsvp, isRsvped, eventStatus } ) {
    
    // button appearance and action
    const { status, pending, toggleRsvp } = useRsvp({ id, can_rsvp, isRsvped });

    // if the cost is 0, say free
    const strCost =
        (cost === 0)
            ? "Free!"
            : "$" + cost.toString();
    
    // if the event is canceled, make the background red
    const activity =
        (eventStatus === "canceled")
            ? "canceled" : "active";

    // so that we can make the card go to the event too
    const navigate = useNavigate();

    return (
        <div className={styles.section}>

            {/* actual event card */}
            <div 
                className={`${styles.card} ${styles[activity]}`} 
                onClick={() => navigate(`/events/${id}`)}
            >

                <DateBadge date={date}/>

                {/* title and event info div */}
                <div>
                    {/* link to the event */}
                    <Link 
                        to={`/events/${id}`} 
                        className={styles.cardTitle}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title}
                        
                    </Link>
                    {/* subheading div, which has a link to the organization */}
                    <div className={styles.cardSubtitle}>
                        <Link 
                            to={`/organization/${organizationId}`} 
                            className={styles.cardSubtitleOrg}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {organization}
                        </Link> 
                        {" • "} 
                        {getFormattedTime(date)} 
                        {" • "} 
                        {strCost}
                    </div>
                </div>
                
                {/* RSVP button and put it on RHS */}
                <div 
                    className={styles.Rsvp}
                    onClick={(e) => e.stopPropagation()}
                > 
                    <RsvpButton 
                        variant="page" 
                        status={status}
                        pending={pending}
                        onClick={toggleRsvp}
                    />
                </div>

            </div>
        </div>
    );
}

export default EventCard;