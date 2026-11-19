// Author: Shayne Lachapelle
// Mounted at /api/events, so the full paths are /api/events/:eventId/rsvp.
import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../db.js';

const router = Router();
const events = db.collection('events');
const rsvps = db.collection('rsvps');

const toObjectId = (id) => (/^[0-9a-fA-F]{24}$/.test(id) ? new ObjectId(id) : null);

// POST /api/events/:eventId/rsvp -> 201 { attendeeCount }
router.post('/:eventId/rsvp', async (req, res, next) => {
  try {
    const eventId = toObjectId(req.params.eventId);
    if (!eventId) return res.status(400).json({ error: 'Invalid event ID.' });
    const userId = new ObjectId(req.user.id);

    // Checked first so someone already going gets this message, not "full".
    if (await rsvps.findOne({ userId, eventId })) {
      return res.status(409).json({ error: "You're already going to this event." });
    }

    // One atomic update: take a spot only if the event is active, upcoming and not full.
    // MongoDB checks and increments in a single step, so two people can't both take the last spot.
    const event = await events.findOneAndUpdate(
      {
        _id: eventId,
        status: 'active',
        start: { $gt: new Date() },
        $or: [{ capacity: null }, { $expr: { $lt: ['$goingCount', '$capacity'] } }],
      },
      { $inc: { goingCount: 1 } },
      { returnDocument: 'after' },
    );

    if (!event) {
      // Nothing matched: look the event up to explain why.
      const existing = await events.findOne({ _id: eventId });
      if (!existing) return res.status(404).json({ error: 'Event not found.' });
      if (existing.status !== 'active') return res.status(409).json({ error: 'This event was cancelled.' });
      if (existing.start <= new Date()) return res.status(409).json({ error: 'This event has already started.' });
      return res.status(409).json({ error: 'This event is full.' });
    }

    try {
      await rsvps.insertOne({ userId, eventId, createdAt: new Date() });
    } catch (err) {
      // 11000 = duplicate key: the same user RSVP'd twice at the same moment.
      // Give back the spot taken above so goingCount stays accurate.
      if (err.code === 11000) {
        await events.updateOne({ _id: eventId }, { $inc: { goingCount: -1 } });
        return res.status(409).json({ error: "You're already going to this event." });
      }
      throw err;
    }

    res.status(201).json({ attendeeCount: event.goingCount });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/events/:eventId/rsvp -> 200 { attendeeCount }
router.delete('/:eventId/rsvp', async (req, res, next) => {
  try {
    const eventId = toObjectId(req.params.eventId);
    if (!eventId) return res.status(400).json({ error: 'Invalid event ID.' });
    const userId = new ObjectId(req.user.id);

    const { deletedCount } = await rsvps.deleteOne({ userId, eventId });
    if (!deletedCount) return res.status(404).json({ error: "You haven't RSVP'd to this event." });

    // Only lower the count when an RSVP was actually removed, and never below 0.
    const event = await events.findOneAndUpdate(
      { _id: eventId, goingCount: { $gt: 0 } },
      { $inc: { goingCount: -1 } },
      { returnDocument: 'after' },
    );

    res.json({ attendeeCount: event?.goingCount ?? 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
