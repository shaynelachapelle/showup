// Author: Grace Yuzwin

// css styling
import styles from "../css/NavBar.module.css"

// logo
import image from "../images/logo.png"

// needed for routing
import { NavLink, Link } from 'react-router-dom';
import { useState } from "react";

// components
import LogoutButton from "./LogoutButton";


function NavBar() {

    {/* track the state of the menu button */}
    const [menuOpen, setMenuOpen] = useState(false);


    return (
        <div className={styles.navWrapper}>

            <div className={styles.navBar}>
                {/* logo links back to home page */}
                <Link to="/home">
                    <img className={styles.logo} src={image} alt="ShowUp"/>
                </Link>


                {/* links to the pages specified */}
                <div className={styles.desktopLinks}>
                    <NavLink
                        to="/myevents"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.myEvents} ${styles.active}`
                                : styles.myEvents
                        }>My events
                    </NavLink>

                    <NavLink
                        to="/allevents"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.allEvents} ${styles.active}`
                                : styles.allEvents
                        }
                    >
                        Explore
                    </NavLink>

                    <NavLink
                        to="/myorgs"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.myOrgs} ${styles.active}`
                                : styles.myOrgs
                        }
                    >
                        My organizations
                    </NavLink>

                    <Link 
                        to="" className={styles.postAnEvent}>Post an Event!
                    </Link>
                </div>
                
                {/* this is the logout button !! */}
                <LogoutButton className={styles.desktopLogout} />
                
                {/* hamburger button */}
                <button 
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                > ☰
                </button>

            </div>
            
            {/* if the menu is open, this shows */}
            {menuOpen && (
                <div className={styles.hamburgerMenu}>

                    <NavLink
                        to="/myevents"
                        className={styles.hamburgerLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        My events
                    </NavLink>

                    <NavLink
                        to="/allevents"
                        className={styles.hamburgerLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        Explore
                    </NavLink>

                    <NavLink
                        to="/myorgs"
                        className={styles.hamburgerLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        My organizations
                    </NavLink>

                    <Link 
                        to="" className={styles.hamburgerLink}>Post an Event!
                    </Link>

                    {/* this is the logout button !! */}
                    <div className={styles.centerButton}>
                        <LogoutButton className={styles.hamburgerLogout} />
                    </div>

                </div>
            )}

        </div>
    );
}

export default NavBar