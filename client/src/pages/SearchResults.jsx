// Author: Grace Yuzwin

// routing and other react imports
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

// api
import { api } from "../api/client";

// component
import EventCard from "../components/EventCard";

// css styling
import styles from "../css/SearchResults.module.css"


function SearchResults() {
    
    // get the search params and get the query
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") ?? "";

    // GET call
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect (() => {

        async function loadResults() {

            try {
                // get the data from api
                const data = await api.get(
                    `/api/events/search?q=${encodeURIComponent(query)}&page=${page}&limit=20`
                );

                setEvents(data.events);
                setTotalPages(data.totalPages);

            } catch(err) {
                // log error if one happened
                console.error(err);
            }
        }
        loadResults();

    }, [query, page])

    // reset the pagination when a new search occurs
    useEffect(() => {

        setPage(1);

    }, [query]);

    // if no events are found, return no matches found
    if (events.length === 0) {
        return (<div>No matches found!</div>)
    }
    
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                {/* link to go back */}
                <Link to="/allevents" className={styles.link}>Back to all events...</Link>

                <div className={styles.heading}>Results:</div>

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

                <div className={styles.pagination}>

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>

                </div>

            </div>
        </div>
    )
}

export default SearchResults;