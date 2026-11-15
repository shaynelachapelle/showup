// Author: Grace Yuzwin
import "../css/EventCard.css"
import RsvpButton from "./RsvpButton"

function EventCard({event}) {
    /* pull out all assumed constants from a single event */
    const { title, date, organization, cost, can_rsvp } = event;
    
    /* display those constants */
    return <div className="event-card">
        <div className="event-image">
            <img src={title}></img>
            <div className="event-overlay">
                <RsvpButton />
            </div>
        </div>
        <div className="event-info">
            <h3>{title}</h3>
            <h4>hosted by {organization}</h4>
            <p>Date & time: {date}</p>
            <p>Cost: {cost}</p>
        </div>
    </div>
}

export default EventCard
