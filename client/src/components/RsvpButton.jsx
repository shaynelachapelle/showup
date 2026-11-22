// Author: Grace Yuzwin

// css styling
import styles from "../css/RsvpButton.module.css"



// to make the RSVP work, need to implement an onClick!!!



function RsvpButton({ variant = "card", status = "rsvp" }) {
    
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

        disabled={status === "full"}
        
        >{text}
    </button>
}

export default RsvpButton