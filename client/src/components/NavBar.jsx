// Author: Grace Yuzwin

import styles from "../css/NavBar.module.css"
import image from "../images/logo.png"
import { NavLink, Link } from 'react-router-dom';


function NavBar() {
    return <div className={styles.navBar}>
        <Link to="/home">
            <img className={styles.logo} src={image}/>
        </Link>

        <Link 
            to="" className={styles.postAnEvent}>Post an Event!
        </Link>

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

    </div>
}

export default NavBar