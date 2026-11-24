// Athor: Grace Yuzwin

// react routing and state
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// css styling
import styles from "../css/SearchBar.module.css"

function SearchBar() {
    // have search term and nav
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // hanler
    function handleSearch () {
        const trimmed = searchTerm.trim();

        if (!trimmed) {
            return;
        }

        // if we have something to send, navigate to the page
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }

    return (
        <div className={styles.container}>
            {/* the search bar */}
            <input
                className={styles.bar}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
                placeholder="Search all events..."
            />  
            {/* the search button */}
            <button className={styles.search} onClick={handleSearch}>
                Go
            </button>
        </div>
    )
}

export default SearchBar;