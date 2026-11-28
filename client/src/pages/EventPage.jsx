// Author: Grace Yuzwin, Shayne Lachapelle

// needed router imports
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";

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
import { api } from "../api/client"

function EventPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    // Cacel event handler
    const cancelEvent = async () => {
        // confirm admin wants to cancel the event
        const confirmed = window.confirm(
            "Are you sure you want to cancel this event?"
        );

        if (!confirmed) {
            return;
        }

        // API call
        try {
            await api.post(
                `/api/events/${id}/cancel`
            );
            // alert that it was cancelled successfully
            alert("Event cancelled successfully.");
            // go to all events
            navigate(`/events/${id}`);

        } catch (err) {
            // log error
            console.error(err);
            // 409 means already canceled
            if (err.response?.status === 409) {
                alert(
                    "This event has already been cancelled."
                );
            } else {
                alert(
                    "Unable to cancel event."
                );
            }
        }
    };

    // delete event handler
    const deleteEvent = async () => {
        // Confirm that the user wants to delete the event
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this event?"
        );

        if (!confirmed) {
            return;
        }

        // the API call
        try {

            await api.delete(
                `/api/events/${id}`
            );
            // show it was deleted
            alert("Event deleted successfully.");
            // go back to the all events page
            navigate(`/organization/${event.organizationId}`);

        } catch (err) {
            // if there is an error, log it
            console.error(err);

            // 409 means it cannot be deleted as there are existing RSVPs 
            if (err.response?.status === 409) {
                alert(
                    "Events with RSVP records cannot be deleted. Cancel the event instead."
                );
            } else {
                alert(
                    "Unable to delete event."
                );
            }
        }
    };

    // GET event
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

    // GET orgs and the user is admin of
    const [adminOrganizations, setAdminOrganizations] = useState([]);

    useEffect(() => {
        async function loadAdminOrganizations() {
            try {
                const data = await api.get(
                    "/api/orgs/administered"
                );

                setAdminOrganizations(data);

            } catch (err) {
                console.error(err);
            }
        }

        loadAdminOrganizations();
    }, []);

    // check if the user is an admin of this events organization
    const isAdmin =
        event.organizationId &&
        adminOrganizations.some(
            org => org.id === event.organizationId
        );

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
    
    // see if event is cancelled
    const cancelled = 
        (event.status === "cancelled") 
            ? true : false


    return (
        <div className={styles.page}>
            <Link to="/explore" className={styles.back}>← explore</Link>

            {/* if the event is cancelled, show that */}
            {cancelled && (
                <div className={styles.cancelledBanner}>
                    EVENT CANCELLED
                </div>
            )}

            {/* if the user is an admin, show the edit button */}
            {isAdmin && (
                <div className={styles.adminControls}>

                    <Link className={styles.adminButtons} to={`/events/${id}/edit`}>
                        Edit Event
                    </Link>

                    {attendeeCount > 0 && (
                        <button className={styles.adminButtons} onClick={cancelEvent}>
                            Cancel Event
                        </button>
                    )}

                    {attendeeCount === 0 && (
                        <button className={styles.adminButtons} onClick={deleteEvent}>
                            Delete Event
                        </button>
                    )}

                </div>
            )}

            <img className={styles.banner} src={imageSrc} alt={event.title}></img>
            
            <div className={styles.outerContainer}>
                {/* top section/left setion */}
                <div className={styles.section}>
                    <div className={styles.title}>{event.title}</div>

                    {/* makes a horizontal line under the hosted by */}
                    <div className={styles.divider}>
                        <Link 
                            to={`/organization/${event.organizationId}`} 
                            className={styles.organization} 
                            title="Go see the organization page!"
                        >
                            Hosted by {event.organizationName}
                        </Link>
                    </div>

                    {/* RSVP section */}
                    <div className={`${styles.divider} ${styles.containerCentered}`}>
                        <RsvpButton 
                            variant="page" 
                            status={status}
                            pending={pending}
                            onClick={toggleRsvp}
                        />
                            
                        <div className={styles.text}>{spotsLeft} spots left!</div>
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

                        {/* hidden while loading and for cancelled events */}
                        {event.status === "active" && <CalendarButton eventId={event.id} />}

                        <button 
                            className={styles.attendees}
                            onClick={() =>
                                navigate(`/events/${event.id}/eventattendees`)
                            }
                        >
                            View Attendees
                        </button>
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