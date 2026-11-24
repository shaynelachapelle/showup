// Author: Shayne Lachapelle
import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../db.js";
import {
  buildGoogleCalendarUrl,
  buildIcs,
  canExportDate,
} from "../calendar.js";

const router = Router();
const events = db.collection("events");
const rsvps = db.collection("rsvps");

function sendIcs(res, filename, eventList) {
  res.set("Cache-Control", "no-store");
  res.attachment(filename).send(buildIcs(eventList));
}

// Shared by both single-event routes: sets res.locals.event.
async function loadEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(eventId)) {
      return res.status(400).json({ error: "Invalid event ID." });
    }

    const event = await events.findOne({ _id: new ObjectId(eventId) });
    if (!event) return res.status(404).json({ error: "Event not found." });
    if (event.status !== "active") {
      return res.status(409).json({ error: "This event was cancelled." });
    }
    if (!canExportDate(event.start)) {
      return res
        .status(400)
        .json({ error: "This event's date can't be exported." });
    }

    res.locals.event = event;
    next();
  } catch (err) {
    next(err);
  }
}

// GET /api/events/:eventId/calendar.ics -> .ics file
router.get("/:eventId/calendar.ics", loadEvent, (req, res) => {
  sendIcs(res, "showup-event.ics", [res.locals.event]);
});

// GET /api/events/:eventId/google-calendar -> 302 to a pre-filled Google Calendar event
router.get("/:eventId/google-calendar", loadEvent, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.redirect(buildGoogleCalendarUrl(res.locals.event));
});

// GET /api/calendar.ics -> .ics file of my upcoming, active RSVPs
export async function downloadMyCalendar(req, res, next) {
  try {
    const myRsvps = await rsvps
      .find({ userId: new ObjectId(req.user.id) })
      .toArray();

    const upcoming = await events
      .find({
        _id: { $in: myRsvps.map((rsvp) => rsvp.eventId) },
        status: "active",
        start: { $gt: new Date() },
      })
      .sort({ start: 1 })
      .toArray();
    // One bad date would make the whole file invalid, so those events are left out.
    const myEvents = upcoming.filter((event) => canExportDate(event.start));

    // An .ics file must contain at least one event.
    if (!myEvents.length) {
      return res
        .status(404)
        .json({ error: "You have no upcoming events to export." });
    }

    sendIcs(res, "showup-my-events.ics", myEvents);
  } catch (err) {
    next(err);
  }
}

export default router;
