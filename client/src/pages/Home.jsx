// Author: Grace Yuzwin
import EventRow from "../components/EventRow";
import banner from "../images/banner.jpg"
import styles from "../css/Home.module.css"

import image1 from "../images/test-1.jpg"
import image2 from "../images/test-2.jpg"
import image3 from "../images/test-3.jpg"
import image4 from "../images/test-4.jpg"
import image5 from "../images/test-5.jpg"

function Home() {
    // have to use fetch, for now use these to populate 
    const events = [
        {title:"Picnic", date:"Aug. 21, 2026", organization:"CSUS", cost:"$5", can_rsvp:true, image:image1, id:1, organizationId:6},
        {title:"Study Session", date:"Sept. 27, 2026", organization:"MSUS", cost:"FREE", can_rsvp:true, image:image2, id:2, organizationId:7},
        {title:"Hangout", date:"Sept. 29, 2026", organization:"Girls Who Code", cost:"$3", can_rsvp:false, image:image3, id:3, organizationId:8},
        {title:"Pre-Halloween", date:"Oct. 15, 2026", organization:"Yay", cost:"$20", can_rsvp:true, image:image4, id:4, organizationId:9},
        {title:"Spooky Season", date:"Oct. 31, 2026", organization:"Place", cost:"$100", can_rsvp:false, image:image5, id:5, organizationId:10}
    ]

    const rsvpedEvents = [
        events[2], events[4]
    ]

    const moreEvents = [
        events[0], events[1], events[3]
    ]

    return (
    <div>
        {/* show the banner  */}
        <img className={styles.banner} src={banner} alt={"image of McGIll mascot"}/>
        
        {/* add the icons for all of the organization types */}

        {/* The first row is the events RSVPed to */}
        <EventRow title="Your RSVPs" events={rsvpedEvents} />

        {/* The second row is all events */}
        <EventRow title="Check Out More Events!" events={moreEvents}/>

        {/* The third row will be events by the organizations they have joined */}
    </div>
    );
}

export default Home