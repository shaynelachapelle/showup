import styles from "../css/RsvpButton.module.css"
import { onRSVPClick } from "../helper-functions/rsvp"

function RsvpButton({ variant = "card" }) {
    return <button className={`${styles.rsvpBttn} ${styles[variant]}`} onClick={onRSVPClick}>RSVP</button>
}

export default RsvpButton