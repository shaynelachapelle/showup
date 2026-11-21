// Author: Grace Yuzwin

// router imports
import { Link, useParams, Navigate } from "react-router-dom";

// css styling
import styles from "../css/CategorizedEvents.module.css"

//components
import EventCard from "../components/EventCard.jsx"

// test images
import image1 from "../images/test-1.jpg"
import image2 from "../images/test-2.jpg"
import image3 from "../images/test-3.jpg"
import image4 from "../images/test-4.jpg"
import image5 from "../images/test-5.jpg"

function CategorizedEvents() {
    // get the requested category
    const { category } = useParams();

    // tranform into passable parameter
    const formatted = category.replace(/\+/g, " ")

    // Have an error check for is the parameter passed is valid
    const isValid = true;

    // if the parameter passed is not valid, redirect to the all events page
    if (!isValid) {
        return <Navigate to="/home" replace />
    }

    // GET call
    const allEvents = [
        {title:"Picnic", date:"Aug. 21, 2026", organization:"CSUS", cost:"$5", can_rsvp:true, image:image1, id:1, organizationId:6, isRsvped:false, category:"Athletics and Recreation"},
        {title:"Study Session", date:"Sept. 27, 2026", organization:"MSUS", cost:"FREE", can_rsvp:true, image:image2, id:2, organizationId:7, isRsvped:true, category:"Charity and Environment"},
        {title:"Hangout", date:"Sept. 29, 2026", organization:"Girls Who Code", cost:"$3", can_rsvp:false, image:image3, id:3, organizationId:8, isRsvped:false, category:"Community Outreach and Volunteering"},
        {title:"Pre-Halloween", date:"Oct. 15, 2026", organization:"Yay", cost:"$20", can_rsvp:true, image:image4, id:4, organizationId:9, isRsvped:false, category:"Fine Arts, Dance and Performance"},
        {title:"Spooky Season", date:"Oct. 31, 2026", organization:"Place", cost:"$100", can_rsvp:false, image:image5, id:5, organizationId:10, isRsvped:true, category:"Health and Wellness"},
        {title:"Picnic", date:"Aug. 21, 2026", organization:"CSUS", cost:"$5", can_rsvp:true, image:image1, id:1, organizationId:6, isRsvped:false, category:"Language and Publications"},
        {title:"Study Session", date:"Sept. 27, 2026", organization:"MSUS", cost:"FREE", can_rsvp:true, image:image2, id:2, organizationId:7, isRsvped:true, category:"Leisure and Hobbies "},
        {title:"Hangout", date:"Sept. 29, 2026", organization:"Girls Who Code", cost:"$3", can_rsvp:false, image:image3, id:3, organizationId:8, isRsvped:false, category:"Networking and Leadership"},
        {title:"Pre-Halloween", date:"Oct. 15, 2026", organization:"Yay", cost:"$20", can_rsvp:true, image:image4, id:4, organizationId:9, isRsvped:false, category:"Political and Social Activism"},
        {title:"Spooky Season", date:"Oct. 31, 2026", organization:"Place", cost:"$100", can_rsvp:false, image:image5, id:5, organizationId:10, isRsvped:true, category:"Athletics and Recreation"},
        {title:"Picnic", date:"Aug. 21, 2026", organization:"CSUS", cost:"$5", can_rsvp:true, image:image1, id:1, organizationId:6, isRsvped:false, category:"Athletics and Recreation"},
        {title:"Study Session", date:"Sept. 27, 2026", organization:"MSUS", cost:"FREE", can_rsvp:true, image:image2, id:2, organizationId:7, isRsvped:true, category:"Athletics and Recreation"},
        {title:"Hangout", date:"Sept. 29, 2026", organization:"Girls Who Code", cost:"$3", can_rsvp:false, image:image3, id:3, organizationId:8, isRsvped:false, category:"Networking and Leadership"},
        {title:"Pre-Halloween", date:"Oct. 15, 2026", organization:"Yay", cost:"$20", can_rsvp:true, image:image4, id:4, organizationId:9, isRsvped:false, category:"Religion and Culture"},
        {title:"Spooky Season", date:"Oct. 31, 2026", organization:"Place", cost:"$100", can_rsvp:false, image:image5, id:5, organizationId:10, isRsvped:true, category:"Political and Social Activism "}
    ]

    const events =  allEvents.filter(
        event => (event.category === formatted)
    );
    // above is replaced

    // if we get no events in a category
    if (events.length === 0) {
        return(
            
            <div className={styles.page}>
                <Link to="/allevents" className={styles.link}>Back to all events...</Link>

                <div className={styles.heading}>{formatted}</div>
                <div className={styles.noEvents}>Sorry, there are no upcoming events in this category</div>
                <Link to="/allevents" className={styles.moreEvents}>Check out some other upcoming events here!</Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* link to go back */}
            <Link to="/allevents" className={styles.link}>Back to all events...</Link>

            {/* headings and grid */}
            <div className={styles.content}>
                {/* headings */}
                <div className={styles.subheading}>Here you can find all events related to:</div>

                <div className={styles.heading}>{formatted}</div>

                {/* grid of events */}
                <div className={styles.events}>
                    {events.map((event) => (
                    <EventCard 
                        key={event.id}
                        id={event.id}
                        organizationId={event.organizationId}
                        title={event.title} 
                        date={event.date}
                        organization={event.organization}
                        image={event.image}
                        cost={event.cost}
                        can_rsvp={event.can_rsvp}
                        isRsvped={event.isRsvped}
                    />
                    ))}
                </div>
            </div>
        </div>
    );

}
export default CategorizedEvents;