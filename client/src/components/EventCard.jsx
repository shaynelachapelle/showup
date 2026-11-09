// Author: Grace Yuzwin
import { onRSVPCLick } from "../helper-functions/rsvp"
import "../css/EventCard.css"

function EventCard({event}) {
    /* pull out all assumed constants from a single event */
    const { title, date, organization, cost, can_rsvp } = event;
    
    /* display those constants */
    return <div className="event-card">
        <div className="event-image">
            <img src={"image.jpg"} alt={title}></img>
            <div className="event-overlay">
                {can_rsvp && (
                    <button
                        className="rsvp-btn-small"
                        onClick={onRSVPCLick}
                    >
                        RSVP
                    </button>
                )}
            </div>
        </div>
        <div className="event-info">
            <h3>{title}</h3>
            <h4>hosted by {organization}</h4>
            <p>Date: {date}</p>
            <p>Cost: {cost}</p>
        </div>
    </div>
}

export default EventCard