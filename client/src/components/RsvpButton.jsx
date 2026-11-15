import styles from "../css/RsvpButton.module.css"
import { onRSVPClick } from "../helper-functions/rsvp"

function RsvpButton() {
    return <button className={styles.rsvpBttn} onClick={onRSVPClick}>RSVP</button>
}

export default RsvpButton