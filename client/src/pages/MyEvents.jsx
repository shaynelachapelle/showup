// Author: Grace Yuzwin

// Css styles
import styles from "../css/MyEvents.module.css"

// other components
import EventColumn from "../components/EventColumn"

// functions that sort events into the day categories
import { getEventCategory } from "../helper-functions/dates"


// will be deleted
import image1 from "../images/test-1.jpg"
import image2 from "../images/test-2.jpg"
import image3 from "../images/test-3.jpg"
import image4 from "../images/test-4.jpg"
import image5 from "../images/test-5.jpg"

function MyEvents() {

    // to be replaced with a fetch
    const events = [
            {title:"Picnic", date:"2026-11-19T16:30:00", organization:"CSUS", cost:"$5", can_rsvp:false, image:image1, id:1, organizationId:10, isRsvped:false},
            {title:"Hangout", date:"2026-11-20T09:00:00", organization:"Girls Who Code", cost:"$3", can_rsvp:false, image:image3, id:2, organizationId:11, isRsvped:true},
            {title:"Pre-Halloween", date:"2026-11-25T12:00:00", organization:"Yay", cost:"$20", can_rsvp:true, image:image4, id:3, organizationId:12, isRsvped:false},
            {title:"Study Session", date:"2026-12-14T09:00:00", organization:"MSUS", cost:"FREE", can_rsvp:true, image:image2, id:5, organizationId:14, isRsvped:true},
            {title:"Spooky Season", date:"2027-01-14T17:00:00", organization:"Place", cost:"$100", can_rsvp:false, image:image5, id:8, organizationId:17, isRsvped:false}
    ]

    // sort the events into today, this week, and later
    const todayEvents = events.filter(
        event => getEventCategory(event.date) === "today"
        );

        const thisWeekEvents = events.filter(
        event => getEventCategory(event.date) === "thisWeek"
        );

        const laterEvents = events.filter(
        event => getEventCategory(event.date) === "later"
    );

    return (
        <div className={styles.pageContainer}>
            {/* heading */}
            <div className={styles.title}>My events</div>
            <div className={styles.subtitle}>Events from the organizations you follow and everything you've RSVP'd to.</div>

            <div className={styles.container}>
                <div className={styles.item}>
                    <EventColumn heading="TODAY" events={todayEvents} emptyMessage="No events today!"/>
                </div>
                <div className={styles.item}>
                    <EventColumn heading="THIS WEEK" events={thisWeekEvents} emptyMessage="No more events this week!"/>
                </div>
                <div className={styles.item}>
                    <EventColumn heading="LATER" events={laterEvents} emptyMessage="No more events!"/>
                </div>
            </div>
        </div>
    );
}

export default MyEvents;