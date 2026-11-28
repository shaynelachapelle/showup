// Author: Grace Yuzwin, Shayne Lachapelle

// css styling
import styles from "../css/RsvpButton.module.css"

function RsvpButton({ variant = "card", status = "rsvp", pending = false, onClick, label }) {
    // check if the button is actually a cancel notif 
    let text = label;
    // decide text on button by passed status
    if(!text) {
        text = "RSVP";

        if (status === "going") {
            text = "✓ going";
        }
        else if (status === "full") {
            text = "FULL";
        }
    }

    // if we are cancelling, use the cancel style
    const buttonStyle =
    label === "CANCELLED"
        ? styles.cancelled
        : styles[status];

    return <button className={`
        ${styles.rsvpBttn} 
        ${styles[variant]} 
        ${buttonStyle}
        `} 

        type="button"
        title={
            label === "CANCELLED"
                ? "Remove this cancelled event from your RSVP list"
                : status === "going"
                    ? "Cancel your RSVP"
                    : undefined
        }
        disabled={status === "full" || pending}
        // detail is the click count: without this, a double-click would RSVP and then cancel
        onClick={(e) => { if (e.detail <= 1) onClick?.(); }}

        >{text}
    </button>
}

export default RsvpButton