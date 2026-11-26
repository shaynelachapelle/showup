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


function EventCard ( { id, organizationId, title, date, organization, cost, can_rsvp, isRsvped} ) {
    
    // button appearance and action
    const { status, pending, toggleRsvp } = useRsvp({ id, can_rsvp, isRsvped });

    // if the cost is 0, say free
    const strCost =
    cost === 0
        ? "Free!"
        : "$" + cost.toString();

    // so that we can make the card go to the event too
    const navigate = useNavigate();

    return (
        <div className={styles.section}>

            {/* actual event card */}
            <div 
                className={styles.card} 
                onClick={() => navigate(`/events/${id}`)}
            >

                <DateBadge date={date}/>

                {/* title and event info div */}
                <div>
                    {/* link to the event */}
                    <Link to={`/events/${id}`} className={styles.cardTitle}>{title}</Link>
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
                <div className={styles.Rsvp}> 
                    <RsvpButton 
                        variant="page" 
                        status={status}
                        pending={pending}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleRsvp();
                        }}
                    />
                </div>

            </div>
        </div>
    );
}

export default EventCard;