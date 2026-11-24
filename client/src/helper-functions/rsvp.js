// Author: Shayne Lachapelle
// RSVP state and toggle, shared by the event cards and the event page.
import { useState } from "react";
import { api } from "../api/client.js";

export function useRsvp(event) {
  const [update, setUpdate] = useState({});
  const [pending, setPending] = useState(false);

  // Changes made here override what the page loaded, for that event only.
  const current = update.id === event.id ? { ...event, ...update } : event;
  const { id, isRsvped, can_rsvp, attendeeCount } = current;

  let status = "rsvp";
  if (isRsvped) status = "going";
  else if (!can_rsvp) status = "full";

  async function toggleRsvp() {
    const path = `/api/events/${id}`;
    let error;

    setPending(true);
    try {
      const data = isRsvped
        ? await api.delete(`${path}/rsvp`)
        : await api.post(`${path}/rsvp`);
      setUpdate({ id, isRsvped: !isRsvped, attendeeCount: data.attendeeCount });
    } catch (err) {
      error = err;
    }

    // Reload even after an error: the event may have filled up, or cancelling may have
    // freed a spot, and only the server knows the new can_rsvp.
    try {
      const latest = await api.get(path);
      setUpdate({
        id,
        isRsvped: latest.isRsvped,
        can_rsvp: latest.can_rsvp,
        attendeeCount: latest.attendeeCount,
      });
    } catch (err) {
      console.error(err);
    }

    setPending(false);
    if (error) alert(error.message);
  }

  return { status, attendeeCount, pending, toggleRsvp };
}
