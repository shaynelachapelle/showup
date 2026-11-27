// Author: Rachel Ha
import { useEffect, useState } from "react";
import ClubCard from "./ClubCard";
import styles from "../css/AllClubs.module.css";
import { api } from "../api/client";

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

// Fake clubs for testing until the backend is connected
const MOCK_CLUBS = [
    { _id: "csus", name: "Computer Science Undergraduate Society", initials: "CSUS", category: "Networking and Leadership" },
    { _id: "drivesafe", name: "DriveSafe", initials: "DS", category: "Community Outreach and Volunteering" },
    { _id: "esports", name: "McGill Esports", initials: "ME", category: "Leisure and Hobbies" },
    { _id: "outdoors", name: "McGill Outdoors Club", initials: "MOC", category: "Athletics and Recreation" },
    { _id: "dance", name: "McGill Dance Pack", initials: "MDP", category: "Fine Arts, Dance and Performance" },
    { _id: "green", name: "McGill Sustainability Network", initials: "MSN", category: "Charity and Environment" }
];

export default function AllClubs() {
    // Save the list of clubs, search text, and selected category
    const [clubs, setClubs] = useState(MOCK_CLUBS);
    const [clubSearch, setClubSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Runs once when the page loads to get clubs from the backend
    useEffect(() => {
        async function loadClubs() {
            try {
                // Backend TODO: uncomment these 2 lines when the clubs API is ready
                // const clubsData = await api.get("/api/organizations");
                // setClubs(clubsData);
            } catch (err) {
                console.error(err);
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
            <h2 className={styles.clubsTitle}>All Clubs</h2>

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

            {/* Show a message if no clubs match, otherwise show the club cards */}
            {filteredClubs.length === 0 ? (
                <p className={styles.emptyClubs}>No clubs match your search.</p>
            ) : (
                <div className={styles.clubsGrid}>
                    {filteredClubs.map((club) => (
                        <ClubCard key={club._id || club.id} club={club} />
                    ))}
                </div>
            )}
        </div>
    );
}