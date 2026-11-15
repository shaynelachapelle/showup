import "../css/RsvpButton.css"
import { onRSVPClick } from "../helper-functions/rsvp"

function RsvpButton() {
    return <button className="rsvp-btn-small" onClick={onRSVPClick}>RSVP</button>
}

export default RsvpButton