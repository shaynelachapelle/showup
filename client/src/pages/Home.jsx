// Author: Grace Yuzwin
import EventCard from "../components/EventCard"

function Home() {
    return (
    <div>
        <EventCard event={{title:"Picnic", date:"August 21, 2026", organization:"CSUS", cost:"$5", can_rsvp:true}}/>
    </div>
    );
}

export default Home