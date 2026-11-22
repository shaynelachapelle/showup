// Author: Grace Yuzwin

// components
import EventRow from "../components/EventRow";
import CategoryRow from "../components/CategoryRow";

// needed images
import banner from "../assets/banner.jpg"

// css styles
import styles from "../css/Home.module.css"

// api needed
import { useEffect, useState } from "react";
import { api } from "../api/client";

function Home() {
    // use state for the events
    const [rsvpedEvents, setRsvpedEvents] = useState([]);
    const [moreEvents, setMoreEvents] = useState([]);

    // GET call
    useEffect(() => {

        async function loadEvents() {   

            try {

                // GET the rsvp data
                const rsvpData =
                    await api.get(
                        "/api/events/my-rsvps?limit=10"
                    );
                
                // GET the all events data
                const allEventsData =
                    await api.get(
                        "/api/events?limit=10"
                    );
            
                // set the events data
                setRsvpedEvents(rsvpData);
                setMoreEvents(allEventsData);
            
            // if there is an error, log it
            // WILL BE CHANGING THIS LATER
            } catch (err) {
                console.error(err);
            }
        }

        loadEvents();

    }, []);


    return (
    <div>
        {/* show the banner  */}
        <img className={styles.banner} src={banner} alt={"image of McGIll mascot"}/>
        
        {/* add the icons for all of the organization types */}
        <div className={styles.events}>
            <CategoryRow />
        </div>
        {/* event rows */}
        <div className={styles.events}>
            {/* The first row is the events RSVPed to */}
            <EventRow 
                title="Your RSVPs" 
                events={rsvpedEvents} 
                linkTo="/myevents" 
                emptyMessage="You are currently not attending any events!" 
                moreMessage="More of your events"
            />

            {/* The second row is all events */}
            <EventRow 
                title="Check Out Some Events!" 
                events={moreEvents} 
                linkTo="/allevents" 
                emptyMessage="You are RSVP'd to all events!!"
                 moreMessage="Find more events!"
            />

            {/* The third row will be events by the organizations they have joined */}
        </div>
    </div>
    );
}

export default Home