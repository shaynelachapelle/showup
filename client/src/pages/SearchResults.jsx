// Author: Grace Yuzwin

// routing and other react imports
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

// api
import { api } from "../api/client";

// component
import EventCard from "../components/EventCard";
import ClubCard from "../components/ClubCard";

// css styling
import styles from "../css/SearchResults.module.css"


function SearchResults() {
    
    // get the search params and get the query
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") ?? "";

    const [loading, setLoading] = useState(true);

    // GET call for events and organizations

    // event constants
    const [events, setEvents] = useState([]);
    const [pageEvent, setPageEvent] = useState(1);
    const [totalPagesEvent, setTotalPagesEvent] = useState(1);

    // org constants
    const [organizations, setOrganizations] = useState([]);
    const [pageOrganization, setPageOrganization] = useState(1);
    const [totalPagesOrganization, setTotalPagesOrganization] = useState(1);

    useEffect (() => {

        async function loadResults() {

            setLoading(true);
            
            try {
                // get the event data from api
                const eventData = await api.get(
                    `/api/events/search?q=${encodeURIComponent(query)}&page=${pageEvent}&limit=20`
                );

                setEvents(eventData.events);
                setTotalPagesEvent(eventData.totalPages);

                // get the organization data from api
                const orgData = await api.get(
                    `/api/orgs/search?q=${encodeURIComponent(query)}&page=${pageOrganization}&limit=20`
                );

                setOrganizations(orgData.organizations);
                setTotalPagesOrganization(orgData.totalPages);

            } catch(err) {
                // log error if one happened
                console.error(err);
            } finally {
                // we are no longer loading
                setLoading(false);
            }
        }
        loadResults();

    }, [query, pageEvent, pageOrganization])

    // reset the pagination when a new search occurs
    useEffect(() => {

        setPageEvent(1);
        setPageOrganization(1);

    }, [query]);

    // if we are loading, return loading
    if (loading) {
        return (
            <div className={styles.page}>
                Loading...
            </div>
        );
    }

    // if no events are found, return no matches found
    if (events.length === 0 && organizations.length === 0) {
        return (
        <div className={styles.page}>
            <div className={styles.subheading}>No matches found for: {query}</div>
            <Link to="/explore" className={styles.moreEvents}>Check out some other upcoming events here!</Link>
        </div>
    )
    }
    
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                {/* link to go back */}
                <Link to="/explore" className={styles.link}>Back to all events...</Link>

                {/* events section */}
                <div className={styles.heading}>Events:</div>

                {/* If there are no events: return empty message */}
                {/* If there are events: return the entire event section */}
                {events.length === 0 ? (
                    <>
                        <div className={styles.subheading}>No event matches found for: {query}</div>
                        <Link to="/explore" className={styles.moreEvents}>Check out some other upcoming events here!</Link>
                    </>
                ) : (
                    <>
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

                        <div className={styles.pagination}>

                            <button
                                disabled={pageEvent === 1}
                                onClick={() => setPageEvent(pageEvent - 1)}
                            >
                                Previous
                            </button>

                            <span>
                                Page {pageEvent} of {totalPagesEvent}
                            </span>

                            <button
                                disabled={pageEvent === totalPagesEvent}
                                onClick={() => setPageEvent(pageEvent + 1)}
                            >
                                Next
                            </button>

                        </div>
                    </>
                )
                }






                <div className={styles.heading}>Organizations:</div>

                {/* If there are no events: return empty message */}
                {/* If there are events: return the entire event section */}

                {organizations.length === 0 ? (
                    <>
                        <div className={styles.subheading}>No organization matches found for: {query}</div>
                        <Link to="/explore" className={styles.moreEvents}>Check out some upcoming events here!</Link>
                    </>

                ) : (
                    <>
                        {/* ORGANIZATIONS */}
                        <div className={styles.organizations}>
                            {organizations.map((club) => (
                                <ClubCard key={club._id || club.id} club={club} />
                            ))}

                        </div>

                        <div className={styles.pagination}>

                            <button
                                disabled={pageOrganization === 1}
                                onClick={() => setPageOrganization(pageOrganization - 1)}
                            >
                                Previous
                            </button>

                            <span>
                                Page {pageOrganization} of {totalPagesOrganization}
                            </span>

                            <button
                                disabled={pageOrganization === totalPagesOrganization}
                                onClick={() => setPageOrganization(pageOrganization + 1)}
                            >
                                Next
                            </button>

                        </div>
                    </>
                )}


            </div>
        </div>
    )
}

export default SearchResults;