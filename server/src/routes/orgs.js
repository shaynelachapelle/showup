// Authors: Shayne Lachapelle, Adam Ahmed
import { Router } from 'express';
import { db } from '../db.js';
import { ObjectId } from 'mongodb';
import { CATEGORIES } from '../categories.js';

const router = Router();
const notImplemented = (req, res) => res.status(501).json({ error: 'Not implemented' });

// GET /api/orgs
// Retrieve organizations with optional limits and pagination.
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

    const collection = db.collection('orgs');

    const formatOrganizations = organizations =>
      organizations.map(org => ({
        id: String(org._id),
        name: org.name,
        image: org.logoUrl ?? '',
        category: org.category
      }));

    if (page === undefined) {
      const organizations = await collection
        .find({})
        .sort({ name: 1, _id: 1 })
        .limit(limitNumber)
        .toArray();

      return res.json(formatOrganizations(organizations));
    }

    const total = await collection.countDocuments({});

    const organizations = await collection
      .find({})
      .sort({ name: 1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();

    res.json({
      organizations: formatOrganizations(organizations),
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    next(error);
  }
});


 // GET /api/orgs/search?q=query&page=1&limit=20
router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q;
    const pageNumber = Number(req.query.page ?? 1);
    const limitNumber = Number(req.query.limit ?? 20);

    if (
      typeof q !== 'string' || !q.trim() ||
      !Number.isSafeInteger(pageNumber) || pageNumber < 1 ||
      !Number.isSafeInteger(limitNumber) || limitNumber < 1 || limitNumber > 100
    ) {
      return res.status(400).json({
        error: 'A search query, valid page, and limit between 1 and 100 are required.'
      });
    }

    // Escape special regex characters in the search query.
    const escapedQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const filter = {
      name: { $regex: escapedQuery, $options: 'i' }
    };

    const total = await db.collection('orgs').countDocuments(filter);

    const organizations = await db.collection('orgs')
      .find(filter)
      .sort({ name: 1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();

    res.json({
      organizations: organizations.map(org => ({
        id: String(org._id),
        name: org.name,
        image: org.logoUrl ?? ''
      })),
    currentPage: pageNumber,
    totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    next(error);
  }
});


// GET /api/orgs/administered
// Retrieve clubs administered by the logged-in user.
router.get('/administered', async (req, res, next) => {
  try {
    const userId = new ObjectId(req.user.id);

    const organizations = await db.collection('orgs')
      .find({ admins: userId })
      .sort({ name: 1, _id: 1 })
      .toArray();

    res.json(organizations.map(org => ({
      id: String(org._id),
      name: org.name,
      image: org.logoUrl ?? ''
    })));
  } catch (error) {
    next(error);
  }
});

 // GET /api/orgs/my-organizations
router.get('/my-organizations', async (req, res, next) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;

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

    const userId = new ObjectId(req.user.id);

    // Find the organizations followed by this student.
    const follows = await db.collection('follows')
      .find({ userId })
      .toArray();

    const orgIds = follows.map(follow => follow.orgId);

    const collection = db.collection('orgs');
    const filter = { _id: { $in: orgIds } };

    const formatOrganizations = organizations =>
      organizations.map(org => ({
        id: String(org._id),
        name: org.name,
        image: org.logoUrl ?? '',
        category: org.category
      }));

    if (page === undefined) {
      const organizations = await collection
        .find(filter)
        .sort({ name: 1, _id: 1 })
        .limit(limitNumber)
        .toArray();

      return res.json(formatOrganizations(organizations));
    }

    const total = await collection.countDocuments(filter);

    const organizations = await collection
      .find(filter)
      .sort({ name: 1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();

    res.json({
      organizations: formatOrganizations(organizations),
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    next(error);
  }
});


 // GET /api/orgs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate the MongoDB organization ID.
    if (!ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid organization ID.'
      });
    }

    const orgId = new ObjectId(id);

    // Find the organization.
    const organization = await db.collection('orgs').findOne({
      _id: orgId
    });

    if (!organization) {
      return res.status(404).json({
        error: 'Organization not found.'
      });
    }

    // Check whether the logged-in student follows this organization.
    const follow = await db.collection('follows').findOne({
      userId: new ObjectId(req.user.id),
      orgId
    });

    // Retrieve only upcoming events for this organization.
    const events = await db.collection('events')
      .find({
        orgId,
        start: { $gt: new Date() },
        status: 'active'
      })
      .sort({ start: 1, _id: 1 })
      .toArray();
    
    // Find which of these events the logged-in student has RSVP'd to.
    const rsvps = await db.collection('rsvps')
      .find({
        userId: new ObjectId(req.user.id),
        eventId: { $in: events.map(event => event._id) }
      })
      .toArray();

    const rsvpedIds = new Set(
      rsvps.map(rsvp => String(rsvp.eventId))
    );  

    res.json({
      id: String(organization._id),
      name: organization.name,
      image: organization.logoUrl ?? '',
      isJoined: follow !== null,
      description: organization.description,
      events: events.map(event => ({
        id: String(event._id),
        title: event.title,
        date: event.start,
        organization: organization.name,
        organizationId: String(event.orgId),
        status: event.status,
        category: event.category,
        image: event.imageUrl,
        cost: event.cost,
        isRsvped: rsvpedIds.has(String(event._id)),
        can_rsvp:
          event.status === 'active' &&
          new Date(event.start) > new Date() &&
          (event.capacity === null || event.goingCount < event.capacity)
      }))
    });
  } catch (error) {
    next(error);
  }
});


 // GET /api/orgs/:id/members
router.get('/:id/members', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate the organization ID.
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid organization ID.'
      });
    }

    const orgId = new ObjectId(id);

    // Check that the organization exists.
    const organization = await db.collection('orgs').findOne({
      _id: orgId
    });

    if (!organization) {
      return res.status(404).json({
        error: 'Organization not found.'
      });
    }

    // Only administrators of this organization can view members.
    const userId = new ObjectId(req.user.id);

    const isAdmin = organization.admins?.some(
      adminId => String(adminId) === String(userId)
    );

    if (!isAdmin) {
      return res.status(403).json({
        error: 'Only club administrators can view members.'
      });
    }

    // Find students following this organization.
    const follows = await db.collection('follows')
      .find({ orgId })
      .toArray();

    const userIds = follows.map(follow => follow.userId);

    // Retrieve their names.
    const users = await db.collection('users')
      .find({ _id: { $in: userIds } })
      .toArray();

    res.json({
      names: users.map(user => user.name)
    });
  } catch (error) {
    next(error);
  }
});


 // POST /api/orgs/:id/join
router.post('/:id/join', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate the organization ID.
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid organization ID.'
      });
    }

    const orgId = new ObjectId(id);
    const userId = new ObjectId(req.user.id);

    // Check whether the organization exists.
    const organization = await db.collection('orgs').findOne({
      _id: orgId
    });

    if (!organization) {
      return res.status(404).json({
        error: 'Organization not found.'
      });
    }

    // Avoid creating duplicate follows.
    const existingFollow = await db.collection('follows').findOne({
      userId,
      orgId
    });

    if (existingFollow) {
      return res.json({ success: true });
    }

    // Add the student to the organization's followers.
    await db.collection('follows').insertOne({
      userId,
      orgId,
      createdAt: new Date()
    });

    // Update the organization's follower count.
    await db.collection('orgs').updateOne(
      { _id: orgId },
      { $inc: { followerCount: 1 } }
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/orgs/:id/join
// Unfollow a club.
router.delete('/:id/join', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid organization ID.'
      });
    }

    const orgId = new ObjectId(id);
    const userId = new ObjectId(req.user.id);

    const organization = await db.collection('orgs').findOne({
      _id: orgId
    });

    if (!organization) {
      return res.status(404).json({
        error: 'Organization not found.'
      });
    }

    const result = await db.collection('follows').deleteOne({
      userId,
      orgId
    });

    if (result.deletedCount > 0) {
      await db.collection('orgs').updateOne(
        { _id: orgId },
        { $inc: { followerCount: -1 } }
      );
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// POST /api/orgs
// Create a club and assign the logged-in user as its administrator.
router.post('/', async (req, res, next) => {
  try {
    const { name, description, category, image } = req.body ?? {};

    // Validate the organization information.
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof description !== 'string' || !description.trim() ||
      !CATEGORIES.includes(category) ||
      (image !== undefined && image !== null && typeof image !== 'string')
    ) {
      return res.status(400).json({
        error: 'Invalid organization information.'
      });
    }

    const userId = new ObjectId(req.user.id);
    const collection = db.collection('orgs');

    // Generate a slug from the organization name.
    const slug = name.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) {
      return res.status(400).json({
        error: 'Invalid organization name.'
      });
    }

    // Prevent duplicate organization slugs.
    const existing = await collection.findOne({ slug });

    if (existing) {
      return res.status(409).json({
        error: 'An organization with this name or slug already exists.'
      });
    }

    const organization = {
      name: name.trim(),
      slug,
      description: description.trim(),
      logoUrl: image?.trim() || null,
      category,
      links: {},
      admins: [userId],
      followerCount: 0,
      createdAt: new Date()
    };

    const result = await collection.insertOne(organization);

    res.status(201).json({
      success: true,
      organizationId: String(result.insertedId)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'An organization with this name or slug already exists.'
      });
    }

    next(error);
  }
});

// PATCH /api/orgs/:orgId
// Allow club administrators to edit their organization's information.
router.patch('/:orgId', async (req, res, next) => {
  try {
    const { orgId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(orgId)) {
      return res.status(400).json({ error: 'Invalid organization ID.' });
    }

    const organization = await db.collection('orgs').findOne({
      _id: new ObjectId(orgId)
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found.' });
    }

    const userId = new ObjectId(req.user.id);

    if (!organization.admins.some(id => id.equals(userId))) {
      return res.status(403).json({
        error: 'Only club administrators can edit this organization.'
      });
    }

    const { name, description, image } = req.body ?? {};
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Invalid organization name.' });
      }
      updates.name = name.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({ error: 'Invalid description.' });
      }
      updates.description = description;
    }

    if (image !== undefined) {
      if (typeof image !== 'string') {
        return res.status(400).json({ error: 'Invalid image.' });
      }
      updates.logoUrl = image;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'Provide at least one field to update.'
      });
    }

    await db.collection('orgs').updateOne(
      { _id: organization._id },
      { $set: updates }
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/:orgId/admins', notImplemented);
router.delete('/:orgId/admins/:userId', notImplemented);

export default router;
