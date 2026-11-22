// Author: Grace Yuzwin

// router imports
import { Link, useParams, Navigate } from "react-router-dom";

// css styling
import styles from "../css/CategorizedEvents.module.css"

//components
import EventCard from "../components/EventCard.jsx"

// for api
import { useEffect, useState } from "react";
import {api} from "../api/client"


function CategorizedEvents() {
    // get the requested category
    const { category } = useParams();

    // tranform into passable parameter
    const formatted = category.replace(/\+/g, " ")

    // GET and pagnation
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // GET call
    useEffect(() => {

        async function loadEvents() {

            try {

                const data = await api.get(
                    `/api/events/category/${formatted}?page=${page}&limit=12`
                );

                setEvents(data.events);
                setTotalPages(data.totalPages);

            } catch (err) {

                console.error(err);

            }
        }

        loadEvents();

    }, [formatted, page]);
    

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

            {/* headings and grid */}
            <div className={styles.content}>
                {/* link to go back */}
                <Link to="/allevents" className={styles.link}>Back to all events...</Link>

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
            {/* PAGES */}
            <div className={styles.pagination}>
                
                {/* previous button, not active when on page 1, moves page back when pressed */}
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                
                {/* says page _ of _ */}
                <span>
                    Page {page} of {totalPages}
                </span>

                {/* nexr button, not active when on last page, moves page forwaed when pressed */}
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>

            </div>
        </div>
    );

}
export default CategorizedEvents;