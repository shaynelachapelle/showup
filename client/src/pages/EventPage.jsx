// Author: Grace Yuzwin, Shayne Lachapelle

// needed router imports
import { useParams, Link, Navigate } from "react-router-dom";

// stock image
import stock from "../assets/no-image.webp"

//helper functions
import { getFormattedDate, getFormattedTime } from "../helper-functions/dates"
import { useRsvp } from "../helper-functions/rsvp"

// css styling
import styles from "../css/EventPage.module.css"

// components
import RsvpButton from "../components/RsvpButton"
import CalendarButton from "../components/CalendarButton";

// for api
import { useEffect, useState } from "react";
import {api} from "../api/client"

function EventPage() {
    const { id } = useParams();

    // GET call
    const [event, setEvent] = useState({});
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {

        async function loadEvents() {

            try {

                const data = await api.get(
                    `/api/events/${id}`
                );

                setEvent(data);

            } catch (err) {
                // if there is an error, log it and set not found
                console.error(err);
                setNotFound(true);
            }
        }

        loadEvents();

    }, [id]);
    
    
    // button appearance and action, plus the live attendee count
    const { status, attendeeCount, pending, toggleRsvp } = useRsvp(event);

    // if the event was not found, return to home page
    if(notFound) {
        return (<Navigate to="/home" replace />)
    }

    // if no image was passed, make image the stock image
    const imageSrc = event.image ?? stock;

    // if the cost is 0, say free
    const strCost =
        event.cost === 0
            ? "Free!"
            : `$${event.cost ?? 0}`;

    //calculate spots left 
    // if there are unlimited spots, unlimited, if not, calulate remaining
    const spotsLeft =
        event.capacity == null
            ? "unlimited"
            : Math.max(
                0,
                event.capacity - attendeeCount
            ).toString();

    return (
        <div className={styles.page}>
            <Link to="/allevents" className={styles.back}>Back to all events...</Link>

            <img className={styles.banner} src={imageSrc} alt={event.title}></img>
            
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
                            <div className={styles.text}>{getFormattedDate(event.date)}</div>
                            <div className={styles.text}>{getFormattedTime(event.date)}</div>
                        </div>

                        {/* right side */}
                        <div className={styles.item}>
                            <div className={styles.subheading}>WHERE</div>
                            <div className={styles.text}>{event.location}</div>

                        </div>
                    </div>

                    <div className={`${styles.divider} ${styles.containerCentered}`}>
                        {/* RSVP section */}
                        <RsvpButton 
                            variant="page" 
                            status={status}
                            pending={pending}
                            onClick={toggleRsvp}
                        />

                        {/* hidden while loading and for cancelled events */}
                        {event.status === "active" && <CalendarButton eventId={event.id} />}

                        <div className={styles.text}>{spotsLeft} spots left!</div>
                    </div>

                    {/* Cost section */}
                    <div className={styles.container}> 
                        <div className={styles.subheading}>COST:</div>
                        <div className={styles.text}>{strCost}</div>
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