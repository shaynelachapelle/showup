// Authors: Shayne Lachapelle, Adam Ahmed
import { Router } from 'express';
import { db } from '../db.js';
import { ObjectId } from 'mongodb';

const router = Router();

const notImplemented = (req, res) =>
  res.status(501).json({ error: 'Not implemented' });

// Convert MongoDB event documents into the API contract format.
async function formatEvents(events) {
  const orgIds = [...new Set(events.map(event => String(event.orgId)))];

  const orgs = await db.collection('orgs')
    .find({ _id: { $in: orgIds.map(id => new ObjectId(id)) } })
    .toArray();

  const orgNames = new Map(
    orgs.map(org => [String(org._id), org.name])
  );

  return events.map(event => ({
    id: String(event._id),
    title: event.title,
    date: event.start,
    organization: orgNames.get(String(event.orgId)) ?? '',
    image: event.imageUrl,
    cost: event.cost,
    can_rsvp:
      event.status === 'active' &&
      new Date(event.start) > new Date() &&
      (event.capacity === null || event.goingCount < event.capacity)
  }));
}

// GET /api/events
router.get('/', async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = page === undefined ? 1 : Number(page);
    const limitNumber = limit === undefined ? 20 : Number(limit);

    if (
      !Number.isSafeInteger(pageNumber) || pageNumber < 1 ||
      !Number.isSafeInteger(limitNumber) || limitNumber < 1 || limitNumber > 100
    ) {
      return res.status(400).json({
        error: 'Page must be a positive integer and limit must be between 1 and 100.'
      });
    }

    const collection = db.collection('events');
    const filter = { start: { $gt: new Date() } };

    // Limited events: return a plain array.
    if (page === undefined) {
      const events = await collection
        .find(filter)
        .sort({ start: 1, _id: 1 })
        .limit(limitNumber)
        .toArray();

      return res.json(await formatEvents(events));
    }

    // Paginated events: return an object with pagination metadata.
    const total = await collection.countDocuments(filter);
    const events = await collection
      .find(filter)
      .sort({ start: 1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();

    res.json({
      events: await formatEvents(events),
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    next(error);
  }
});


// GET /api/events/search?q=query&page=1&limit=20
router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q;
    const page = req.query.page ?? '1';
    const limit = req.query.limit ?? '20';

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      typeof q !== 'string' ||
      !q.trim() ||
      !Number.isSafeInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isSafeInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        error: 'A search query, valid page, and limit between 1 and 100 are required.'
      });
    }

    // Escape special regex characters in the search text.
    const escapedQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const filter = {
      title: { $regex: escapedQuery, $options: 'i' },
      start: { $gt: new Date() }
    };

    const collection = db.collection('events');
    const total = await collection.countDocuments(filter);

    const events = await collection
      .find(filter)
      .sort({ start: 1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();

    res.json({
      events: await formatEvents(events),
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    next(error);
  }
});


router.get('/feed', notImplemented);

 // GET /api/events/my-rsvps?limit=5
router.get('/my-rsvps', async (req, res, next) => {
  try {
    const limitNumber = Number(req.query.limit ?? 20);

    if (
      !Number.isSafeInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        error: 'Limit must be between 1 and 100.'
      });
    }

    const userId = new ObjectId(req.user.id);

    // Find events the logged-in student has RSVP'd to.
    const rsvps = await db.collection('rsvps')
      .find({ userId })
      .toArray();

    const eventIds = rsvps.map(rsvp => rsvp.eventId);

    // Retrieve upcoming RSVP'd events in chronological order.
    const events = await db.collection('events')
      .find({
        _id: { $in: eventIds },
        start: { $gt: new Date() }
      })
      .sort({ start: 1, _id: 1 })
      .limit(limitNumber)
      .toArray();

    res.json(await formatEvents(events));
  } catch (error) {
    next(error);
  }
});


 // GET /api/events/my-events?page=1&limit=20
// Retrieve the logged-in student's RSVP'd events with pagination.
router.get('/my-events', async (req, res, next) => {
  try {
    const pageNumber = Number(req.query.page ?? 1);
    const limitNumber = Number(req.query.limit ?? 20);

    if (
      !Number.isSafeInteger(pageNumber) || pageNumber < 1 ||
      !Number.isSafeInteger(limitNumber) || limitNumber < 1 || limitNumber > 100
    ) {
      return res.status(400).json({
        error: 'Page must be a positive integer and limit must be between 1 and 100.'
      });
    }

    const userId = new ObjectId(req.user.id);

    // Find events the student has RSVP'd to.
    const rsvps = await db.collection('rsvps')
      .find({ userId })
      .toArray();

    const eventIds = rsvps.map(rsvp => rsvp.eventId);

    const collection = db.collection('events');
    const filter = {
      _id: { $in: eventIds },
      start: { $gt: new Date() }
    };

    const total = await collection.countDocuments(filter);

    // Retrieve the requested page of events.
    const events = await collection
      .find(filter)
      .sort({ start: 1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();

    res.json({
      events: await formatEvents(events),
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    next(error);
  }
});


// GET /api/events/:eventId
// Retrieve an event's details, organization, and the student's RSVP status.
router.get('/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!ObjectId.isValid(eventId) || !/^[0-9a-fA-F]{24}$/.test(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }

    const event = await db.collection('events').findOne({
      _id: new ObjectId(eventId)
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const organization = await db.collection('orgs').findOne({
      _id: event.orgId
    });

    const rsvp = await db.collection('rsvps').findOne({
      userId: new ObjectId(req.user.id),
      eventId: event._id
    });

    res.json({
      id: String(event._id),
      title: event.title,
      description: event.description,
      date: event.start,
      cost: event.cost,
      image: event.imageUrl,
      location: event.location?.name ?? '',
      organizationId: String(event.orgId),
      organizationName: organization?.name ?? '',
      attendeeCount: event.goingCount,
      isRsvped: rsvp !== null
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/events
// Create a new event for a club administered by the logged-in user.
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      cost,
      location,
      capacity,
      image
    } = req.body ?? {};

    // Validate the event information.
    const start = new Date(date);

    if (
      typeof title !== 'string' || !title.trim() ||
      typeof description !== 'string' || !description.trim() ||
      typeof date !== 'string' ||
      !Number.isFinite(start.getTime()) ||
      typeof location !== 'string' || !location.trim() ||
      typeof cost !== 'number' || !Number.isFinite(cost) || cost < 0 ||
      !Number.isSafeInteger(capacity) || capacity < 1 ||
      typeof image !== 'string'
    ) {
      return res.status(400).json({
        error: 'Invalid event information.'
      });
    }

    // Find clubs administered by the logged-in user.
    const userId = new ObjectId(req.user.id);

    const organizations = await db.collection('orgs')
      .find({ admins: userId })
      .toArray();

    if (organizations.length === 0) {
      return res.status(403).json({
        error: 'You must be a club administrator to create events.'
      });
    }

    // An administrator manages one club.
    // Reject ambiguous accounts instead of choosing the wrong club.
    if (organizations.length > 1) {
      return res.status(409).json({
        error: 'This account administers multiple clubs. Cannot determine which club owns the event.'
      });
    }

    const organization = organizations[0];

    const event = {
      orgId: organization._id,
      title: title.trim(),
      description: description.trim(),
      category: organization.category,
      start,
      end: start,
      location: {
        name: location.trim(),
        address: '',
        lat: null,
        lng: null
      },
      capacity,
      goingCount: 0,
      cost,
      imageUrl: image,
      status: 'active',
      createdBy: userId,
      createdAt: new Date()
    };

    const result = await db.collection('events').insertOne(event);

    res.status(201).json({
      success: true,
      eventId: String(result.insertedId)
    });
  } catch (error) {
    next(error);
  }
});


 // GET /api/events/:eventId/attendees
router.get('/:eventId/attendees', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Validate the event ID.
    if (!ObjectId.isValid(eventId) || !/^[0-9a-fA-F]{24}$/.test(eventId)) {
      return res.status(400).json({
        error: 'Invalid event ID.'
      });
    }

    const event = await db.collection('events').findOne({
      _id: new ObjectId(eventId)
    });

    if (!event) {
      return res.status(404).json({
        error: 'Event not found.'
      });
    }

    // Only administrators of this event's club can view attendees.
    const userId = new ObjectId(req.user.id);

    const organization = await db.collection('orgs').findOne({
      _id: event.orgId,
      admins: userId
    });

    if (!organization) {
      return res.status(403).json({
        error: 'Only club administrators can view attendees.'
      });
    }

    // Find all RSVPs for this event.
    const rsvps = await db.collection('rsvps')
      .find({ eventId: event._id })
      .toArray();

    const userIds = rsvps.map(rsvp => rsvp.userId);

    // Look up the corresponding student names.
    const users = await db.collection('users')
      .find({ _id: { $in: userIds } })
      .toArray();

    const names = users.map(user => user.name);

    res.json({ names });
  } catch (error) {
    next(error);
  }
});

router.patch('/:eventId', notImplemented);
router.post('/:eventId/cancel', notImplemented);
router.delete('/:eventId', notImplemented);

export default router;
