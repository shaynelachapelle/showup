// Author: Grace Yuzwin

// components
import EventRow from "../components/EventRow";
import CategoryRow from "../components/CategoryRow";
import ClubCard from "../components/ClubCard"; // <-- ADDED

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

    // ADDED: temporary mock data for "Your Clubs"
    // TODO (Backend): Replace with api.get("/api/organizations/my-orgs?limit=10") inside loadEvents()
    const [followedClubs, setFollowedClubs] = useState([
        { _id: "csus", name: "Computer Science Undergraduate Society", initials: "CSUS", category: "Academic" },
        { _id: "drivesafe", name: "DriveSafe", initials: "DS", category: "Service" },
        { _id: "esports", name: "McGill Esports", initials: "ME", category: "Gaming" }
    ]);

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
                linkTo="/allevents"
                emptyMessage="You are RSVP'd to all events!!"
                moreMessage="Find more events!"
            />

            {/* ADDED: The third row: Your Clubs */}
            <section style={{ marginTop: "2rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Your Clubs</h2>
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
    </div>
    );
}

export default Home;