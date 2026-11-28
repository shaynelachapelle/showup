// Author: Grace Yuzwin

// components
import EventRow from "../components/EventRow";
import CategoryRow from "../components/CategoryRow";
import ClubCard from "../components/ClubCard";

// needed images
import banner from "../assets/banner.jpg";

// css styles
import styles from "../css/Home.module.css";

// api needed
import { useEffect, useState } from "react";
import { api } from "../api/client";

function Home() {
    // use state for the events and followed clubs
    const [rsvpedEvents, setRsvpedEvents] = useState([]);
    const [moreEvents, setMoreEvents] = useState([]);
    const [followedClubs, setFollowedClubs] = useState([]);

    // GET call
    useEffect(() => {
        async function loadHomeData() {
            try {
                const [rsvpData, allEventsData, myOrgsData] = await Promise.all([
                    api.get("/api/events/my-rsvps?limit=10"),
                    api.get("/api/events?limit=10"),
                    api.get("/api/orgs/my-organizations?limit=10"),
                ]);

                setRsvpedEvents(rsvpData);
                setMoreEvents(allEventsData);
                setFollowedClubs(myOrgsData);
            } catch (err) {
                console.error(err);
            }
        }

        loadHomeData();
    }, []);

    return (
    <div className={styles.page}>
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
                title="My RSVPs" 
                events={rsvpedEvents} 
                linkTo="/myevents" 
                emptyMessage="You are currently not attending any events!" 
                moreMessage="More of your events"
            />

            {/* The second row is all events */}
            <EventRow
                title="Check Out Some Events!"
                events={moreEvents}
                linkTo="/explore"
                emptyMessage="You are RSVP'd to all events!!"
                moreMessage="Find more events!"
            />

            {/* ADDED: The third row: Your Clubs */}
            <section style={{ marginTop: "2rem", paddingLeft: "2%", paddingRight: "1rem" }}>
                <h2 style={{ fontSize: "30px", marginBottom: "0px" }}>Your Clubs</h2>
                {followedClubs.length === 0 ? (
                    <p>You haven't followed any clubs yet!</p>
                ) : (
                    <div style={{ display: "flex", gap: "1rem", overflowX: "auto", padding: "8px 4px 0.75rem" }}>
                        {followedClubs.map((club) => (
                            <ClubCard key={club._id || club.id} club={club} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;