// Author: Grace Yuzwin

// components
import EventRow from "../components/EventRow";
import AllClubs from "../components/AllClubs";

// css styles
import styles from "../css/AllEvents.module.css"

// for api
import { useEffect, useState } from "react";
import {api} from "../api/client"

function AllEvents() {

    // GET call
    const [athleticsEvents, setathleticsEvents] = useState([]);
    const [charityEvents,   setcharityEvents]   = useState([]);
    const [communityEvents, setcommunityEvents] = useState([]);
    const [artsEvents,      setartsEvents]      = useState([]);
    const [healthEvents,    sethealthEvents]    = useState([]);
    const [languageEvents,  setlanguageEvents]  = useState([]);
    const [leisureEvents,   setleisureEvents]   = useState([]);
    const [networkEvents,   setnetworkEvents]   = useState([]);
    const [politicalEvents, setpoliticalEvents] = useState([]);
    const [religionEvents,  setreligionEvents]  = useState([]);

    useEffect (() => {

        async function loadEvents() {

            try {
                // Athletics and Recreation
                const athleticsData = await api.get(
                    "/api/events/category/Athletics and Recreation?limit=8"
                );

                setathleticsEvents(athleticsData);

                // Charity and Environment
                const charityData = await api.get(
                    "/api/events/category/Charity and Environment?limit=8"
                );

                setcharityEvents(charityData);

                // Community Outreach and Volunteering
                const communityData = await api.get(
                    "/api/events/category/Community Outreach and Volunteering?limit=8"
                );

                setcommunityEvents(communityData);

                // Fine Arts, Dance and Performance
                const artsData = await api.get(
                    "/api/events/category/Fine Arts, Dance and Performance?limit=8"
                );

                setartsEvents(artsData);

                // Health and Wellness
                const healthData = await api.get(
                    "/api/events/category/Health and Wellness?limit=8"
                );

                sethealthEvents(healthData);

                // Language and Publications
                const languageData = await api.get(
                    "/api/events/category/Language and Publications?limit=8"
                );

                setlanguageEvents(languageData);

                // Leisure and Hobbies
                const leisureData = await api.get(
                    "/api/events/category/Leisure and Hobbies?limit=8"
                );

                setleisureEvents(leisureData);

                // Networking and Leadership
                const networkData = await api.get(
                    "/api/events/category/Networking and Leadership?limit=8"
                );

                setnetworkEvents(networkData);

                // Political and Social Activism
                const politicalData = await api.get(
                    "/api/events/category/Political and Social Activism?limit=8"
                );

                setpoliticalEvents(politicalData);

                // Religion and Culture
                const relogionData = await api.get(
                    "/api/events/category/Religion and Culture?limit=8"
                );

                setreligionEvents(relogionData);

            } catch (err) {
                console.error(err);
            }

        }
        loadEvents();
    }
    , []);
    
    
    return (
    <div>
        <div className={styles.page}>
            {/* All Clubs section */}
            <AllClubs />
            

            {/* page title */}
            <div className={styles.title}>All Events</div>


            {/* event rows */}


            {/* Athletics and Recreation row */}
            <EventRow title="Athletics and Recreation" events={athleticsEvents} linkTo="/explore/Athletics+and+Recreation" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Charity and Environment row */}
            <EventRow title="Charity and Environment" events={charityEvents} linkTo="/explore/Charity+and+Environment" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Community Outreach and Volunteering row */}
            <EventRow title="Community Outreach and Volunteering" events={communityEvents} linkTo="/explore/Community+Outreach+and+Volunteering" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Fine Arts, Dance and Performance row */}
            <EventRow title="Fine Arts, Dance and Performance" events={artsEvents} linkTo="/explore/Fine Arts,+Dance+and+Performance" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Health and Wellness row */}
            <EventRow title="Health and Wellness" events={healthEvents} linkTo="/explore/Health+and+Wellness" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Language and Publications row */}
            <EventRow title="Language and Publications" events={languageEvents} linkTo="/explore/Language+and+Publications" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Leisure and Hobbies row */}
            <EventRow title="Leisure and Hobbies" events={leisureEvents} linkTo="/explore/Leisure+and+Hobbies" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Networking and Leadership row */}
            <EventRow title="Networking and Leadership" events={networkEvents} linkTo="/explore/Networking+and+Leadership" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Political and Social Activism row */}
            <EventRow title="Political and Social Activism" events={politicalEvents} linkTo="/explore/Political+and+Social+Activism" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>

            {/* Religion and Culture row */}
            <EventRow title="Religion and Culture" events={religionEvents} linkTo="/explore/Religion+and+Culture" emptyMessage="There are currently no events in this category!" moreMessage="More events"/>
        </div>
    </div>
    );
}

export default AllEvents