// Author: Grace Yuzwin

// components
import EventRow from "../components/EventRow";
import CategoryRow from "../components/CategoryRow";

// needed images
import banner from "../images/banner.jpg"

// css styles
import styles from "../css/Home.module.css"


// test images
import image1 from "../images/test-1.jpg"
import image2 from "../images/test-2.jpg"
import image3 from "../images/test-3.jpg"
import image4 from "../images/test-4.jpg"
import image5 from "../images/test-5.jpg"

function Home() {
    // have to use fetch, for now use these to populate 
    const events = [
            {title:"Picnic", date:"2026-11-19T16:30:00", organization:"CSUS", cost:"$5", can_rsvp:false, image:image1, id:1, organizationId:10, isRsvped:false},
            {title:"Hangout", date:"2026-11-20T09:00:00", organization:"Girls Who Code", cost:"$3", can_rsvp:false, image:image3, id:2, organizationId:11, isRsvped:true},
            {title:"Pre-Halloween", date:"2026-11-21T12:00:00", organization:"Yay", cost:"$20", can_rsvp:true, image:image4, id:3, organizationId:12, isRsvped:false},
            {title:"Study Session", date:"2026-11-22T09:00:00", organization:"MSUS", cost:"FREE", can_rsvp:true, image:image2, id:5, organizationId:14, isRsvped:true},
            {title:"Spooky Season", date:"2026-11-23T17:00:00", organization:"Place", cost:"$100", can_rsvp:false, image:image5, id:8, organizationId:17, isRsvped:false}
    ]

    const rsvpedEvents = events.filter(
        event => event.isRsvped
    );

    const moreEvents = events.filter(
        event => !event.isRsvped
    );

    //replace above with:

    // call to get RSVPed events

    // call to get non-RSVPed events

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
            <EventRow title="Your RSVPs" events={rsvpedEvents} linkTo="/myevents" emptyMessage="Find an event to attend!" moreMessage="More of your events"/>

            {/* The second row is all events */}
            <EventRow title="Check Out More Events!" events={moreEvents} linkTo="/allevents" emptyMessage="There are no more events for you to see!" moreMessage="Find more events!"/>

            {/* The third row will be events by the organizations they have joined */}
        </div>
    </div>
    );
}

export default Home