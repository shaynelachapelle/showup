// Author: Grace Yuzwin
import styles from "../css/EventCard.module.css"
import RsvpButton from "./RsvpButton"

function EventCard({title, date, organization, cost, image, can_rsvp}) {
    
    /* display those constants */
    return <div className={styles.eventCard}>

        <div className={styles.eventImage}>

            <img src={image} alt={title}></img>
            <div className={styles.eventOverlay}>
                <RsvpButton />
            </div>

        </div>

        <div className={styles.eventInfo}>

            <h3>{title}</h3>
            <h4>hosted by {organization}</h4>
            <p>Date & time: {date}</p>
            <p>Cost: {cost}</p>
            
        </div>
    </div>
}

export default EventCard
