// Author: Grace Yuzwin

// components
import EventRow from "../components/EventRow";

// css styles
import styles from "../css/AllEvents.module.css"


// test images
import image1 from "../images/test-1.jpg"
import image2 from "../images/test-2.jpg"
import image3 from "../images/test-3.jpg"
import image4 from "../images/test-4.jpg"
import image5 from "../images/test-5.jpg"

function AllEvents() {
    // have to use fetch, for now use these to populate 
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
    const noEvents =[]
    
    
    return (
    <div>
        <div className={styles.page}>

            {/* page title */}
            <div className={styles.title}>All Events</div>


            {/* event rows */}


            {/* Athletics and Recreation row */}
            <EventRow title="Athletics and Recreation" events={noEvents} linkTo="/allevents/Athletics+and+Recreation" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Charity and Environment row */}
            <EventRow title="Charity and Environment" events={allEvents} linkTo="/allevents/Charity+and+Environment" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Community Outreach and Volunteering row */}
            <EventRow title="Community Outreach and Volunteering" events={allEvents} linkTo="/allevents/Community+Outreach+and+Volunteering" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Fine Arts, Dance and Performance row */}
            <EventRow title="Fine Arts, Dance and Performance" events={allEvents} linkTo="/allevents/Fine Arts,+Dance+and+Performance" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Health and Wellness row */}
            <EventRow title="Health and Wellness" events={allEvents} linkTo="/allevents/Health+and+Wellness" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Language and Publications row */}
            <EventRow title="Language and Publications" events={allEvents} linkTo="/allevents/Language+and+Publications" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Leisure and Hobbies row */}
            <EventRow title="Leisure and Hobbies" events={allEvents} linkTo="/allevents/Leisure+and+Hobbies" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Networking and Leadership row */}
            <EventRow title="Networking and Leadership" events={allEvents} linkTo="/allevents/Networking+and+Leadership" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Political and Social Activism row */}
            <EventRow title="Political and Social Activism" events={allEvents} linkTo="/allevents/Political+and+Social+Activism" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Religion and Culture row */}
            <EventRow title="Religion and Culture" events={allEvents} linkTo="/allevents/Religion+and+Culture" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>
        </div>
    </div>
    );
}

export default AllEvents