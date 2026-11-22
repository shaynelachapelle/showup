// Author: Grace Yuzwin

// components
import EventRow from "../components/EventRow";

// css styles
import styles from "../css/AllEvents.module.css"


function AllEvents() {

    // GET call
    const allEvents = []
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