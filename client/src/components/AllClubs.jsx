// Author: Rachel Ha, Adam Ahmed
import { useEffect, useState } from "react";
import ClubCard from "./ClubCard";
import styles from "../css/AllClubs.module.css";
import { api } from "../api/client";
import { Link } from "react-router-dom";

// List of categories for the dropdown filter
const CATEGORIES = [
    "All",
    "Athletics and Recreation",
    "Charity and Environment",
    "Community Outreach and Volunteering",
    "Fine Arts, Dance and Performance",
    "Health and Wellness",
    "Language and Publications",
    "Leisure and Hobbies",
    "Networking and Leadership",
    "Political and Social Activism",
    "Religion and Culture"
];

export default function AllClubs() {
    // Save the list of clubs, search text, and selected category
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [clubSearch, setClubSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Runs once when the page loads to get clubs from the backend
    useEffect(() => {
        async function loadClubs() {
            try {
                const allClubs = [];
                let page = 1;
                let totalPages = 1;

                do {
                    const data = await api.get(
                        `/api/orgs?page=${page}&limit=100`
                    );

                    allClubs.push(...data.organizations);
                    totalPages = data.totalPages;
                    page++;
                } while (page <= totalPages);

                setClubs(allClubs);
            } catch (err) {
                console.error(err);
                setError("Unable to load clubs.");
            } finally {
                setLoading(false);
            }
        }

        loadClubs();
    }, []);

    // Filter the clubs based on the search bar and category dropdown
    const filteredClubs = clubs.filter((club) => {
        const matchesCategory = selectedCategory === "All" || club.category === selectedCategory;
        const matchesSearch = club.name.toLowerCase().includes(clubSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.clubsSection}>
            <div className={styles.clubsHeader}>
                <h2 className={styles.clubsTitle}>All Clubs</h2>

                <Link to="/createclub" className={styles.createClubBtn}>
                    + Make a Club
                </Link>
            </div>

            {/* Search bar and category dropdown */}
            <div className={styles.clubFilters}>
                <input
                    type="text"
                    placeholder="Search clubs..."
                    value={clubSearch}
                    onChange={(e) => setClubSearch(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={styles.categorySelect}
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Show loading, error, empty state, or club cards */}
            {loading ? (
                <p className={styles.emptyClubs}>Loading clubs...</p>
            ) : error ? (
                <p className={styles.emptyClubs}>{error}</p>
            ) : filteredClubs.length === 0 ? (
                <p className={styles.emptyClubs}>No clubs match your search.</p>
            ) : (
                <div className={styles.clubsGrid}>
                    {filteredClubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                    ))}
                </div>
            )}
        </div>
    );
}