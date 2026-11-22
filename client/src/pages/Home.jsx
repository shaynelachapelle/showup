// Author: Grace Yuzwin

// components
import EventRow from "../components/EventRow";
import CategoryRow from "../components/CategoryRow";

// needed images
import banner from "../images/banner.jpg"

// css styles
import styles from "../css/Home.module.css"

function Home() {


    // GET calls for RSVP'd events and all events
    const events = []

    const rsvpedEvents = events.filter(
        event => event.isRsvped
    );

    const moreEvents = events.filter(
        event => !event.isRsvped
    );


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