// Author: Grace Yuzwin

import { useParams, Link } from "react-router-dom";
import styles from "../css/EventPage.module.css"
import RsvpButton from "../components/RsvpButton"

// get rid of once backend is connected
import image1 from "../images/test-3.jpg"

function EventPage() {
    const { id } = useParams();

    // have to do fetch, for now use defined
    const event = 
        {
            id: id,
            title: "Potluck",
            description: "Join the community at the potluck! Cost will cover the stuff! Woooooo!",
            date: "Jan 5, 2017",
            time: "4pm",
            cost: 10,
            image: image1,
            location: "Trottier Institue",
            organizationName: "CSUS",
            organizationId: 2,
            attendeeCount: 21,
            capacity: 40,
            isRsvped: true
        }

    //calculate spots left forcing calculating only once
    const spotsLeft = Math.max(0, event.capacity - event.attendeeCount);

    return (
        <div className={styles.page}>
            <Link to="/allevents" className={styles.back}>Back to all events...</Link>

            <img className={styles.banner} src={event.image} alt={event.title}></img>
            
            <div className={styles.outerContainer}>
                {/* top section/left setion */}
                <div className={styles.section}>
                    <div className={styles.title}>{event.title}</div>

                    {/* makes a horizontal line under the hosted by */}
                    <div className={styles.divider}>
                        <Link to={`/organization/${event.organizationId}`} className={styles.organization} title="Go see the organization page!">Hosted by {event.organizationName}</Link>
                    </div>

                    {/* the flexbox for when and where */}
                    <div className={`${styles.divider} ${styles.container}`}>

                        {/* left side */}
                        <div className={styles.item}>
                            <div className={styles.subheading}>WHEN</div>
                            <div className={styles.text}>{event.date}</div>
                            <div className={styles.text}>{event.time}</div>
                        </div>

                        {/* right side */}
                        <div className={styles.item}>
                            <div className={styles.subheading}>WHERE</div>
                            <div className={styles.text}>{event.location}</div>

                        </div>
                    </div>

                    <div className={`${styles.divider} ${styles.containerCentered}`}>
                        {/* RSVP section */}
                        <RsvpButton variant="page"/>
                        <div className={styles.text}>{spotsLeft} spots left!</div>

                    </div>

                    {/* Cost section */}
                    <div className={styles.container}> 
                        <div className={styles.subheading}>COST:</div>
                        <div className={styles.text}>${event.cost}</div>
                    </div>

                </div>

                {/* about section which is the bottom/right section */}
                <div className={styles.section}>
                    <div className={styles.subtitle}>About this event</div>
                    <div className={styles.text}>{event.description}</div>
                </div>
            </div>
        </div>
    );
} 

export default EventPage;