import styles from "../css/NavBar.module.css"
import image from "../images/logo.png"
import { Link } from 'react-router-dom';

function NavBar() {
    return <div className={styles.navBar}>
        <Link to="/Home">
            <img className={styles.logo} src={image}/>
        </Link>
        <Link 
            to="" className={styles.postAnEvent}>Post an Event!
        </Link>
        <Link 
            to="/MyEvents" className={styles.myEvents}>Your RSVPs
        </Link>
        <Link
            to="/AllEvents" className={styles.allEvents}>More Events
        </Link>
        <Link
            to="/MyOrgs" className={styles.myOrgs}>Your Organizations
        </Link>
    </div>
} 

export default NavBar