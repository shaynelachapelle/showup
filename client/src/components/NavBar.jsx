import styles from "../css/NavBar.module.css"
import image from "../images/logo.png"
import { Link } from 'react-router-dom';

function NavBar() {
    return <div className={styles.navBar}>
        <Link to="/home">
            <img className={styles.logo} src={image}/>
        </Link>
        <Link 
            to="" className={styles.postAnEvent}>Post an Event!
        </Link>
        <Link 
            to="/myevents" className={styles.myEvents}>Your RSVPs
        </Link>
        <Link
            to="/allevents" className={styles.allEvents}>More Events
        </Link>
        <Link
            to="/myorgs" className={styles.myOrgs}>Your Organizations
        </Link>
    </div>
} 

export default NavBar