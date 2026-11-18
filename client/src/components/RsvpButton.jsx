import styles from "../css/RsvpButton.module.css"
import { onRSVPClick } from "../helper-functions/rsvp"

function RsvpButton({ variant = "card", status = "rsvp" , onClick }) {
    
    let text = "RSVP";

    if (status === "going") {
        text = "going!";
    }
    else if (status === "full") {
        text = "FULL";
    }

    return <button className={`
        ${styles.rsvpBttn} 
        ${styles[variant]} 
        ${styles[status]}
        `} 
        disabled={status === "full"}
        onClick={onClick}>{text}
    </button>
}

export default RsvpButton