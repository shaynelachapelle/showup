import { useParams } from "react-router-dom";

function EventPage() {
    const { id } = useParams();

    return (
        <h1>This is the event page for topic: { id }</h1>
    );
}

export default EventPage;