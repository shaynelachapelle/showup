// Author: Grace Yuzwin, Shayne Lachapelle

// css styling
import styles from "../css/RsvpButton.module.css"

function RsvpButton({ variant = "card", status = "rsvp", pending = false, onClick }) {
    
    // decide text on button by passed status
    let text = "RSVP";

    if (status === "going") {
        text = "✓ going";
    }
    else if (status === "full") {
        text = "FULL";
    }

    return <button className={`
        ${styles.rsvpBttn} 
        ${styles[variant]} 
        ${styles[status]}
        `} 

        type="button"
        title={status === "going" ? "Cancel your RSVP" : undefined}
        disabled={status === "full" || pending}
        // detail is the click count: without this, a double-click would RSVP and then cancel
        onClick={(e) => { if (e.detail <= 1) onClick?.(); }}

        >{text}
    </button>
}

export default RsvpButton