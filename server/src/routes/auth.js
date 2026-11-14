// Author: Shayne Lachapelle
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { db } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { TOKEN_COOKIE, cookieOptions, setTokenCookie } from '../token.js';

const router = Router();
const users = db.collection('users');

const MCGILL_EMAIL = /^[^\s@]+@(mail\.)?mcgill\.ca$/;
const BCRYPT_ROUNDS = 10;

// Never send passwordHash to the client.
const publicUser = (user) => ({ id: user._id.toString(), email: user.email, name: user.name });

// POST /api/auth/register  { email, password, name } -> 201 { user }
router.post('/register', async (req, res, next) => {
  try {
    const email = String(req.body.email ?? '').trim().toLowerCase();
    const password = String(req.body.password ?? '');
    const name = String(req.body.name ?? '').trim();

    if (!MCGILL_EMAIL.test(email)) {
      return res.status(400).json({ error: 'Use your @mail.mcgill.ca or @mcgill.ca email.' });
    }
    // bcrypt only uses the first 72 bytes of a password, so longer ones are rejected.
    if (password.length < 8 || Buffer.byteLength(password) > 72) {
      return res.status(400).json({ error: 'Password must be 8 to 72 characters.' });
    }
    if (!name || name.length > 100) {
      return res.status(400).json({ error: 'Name is required (max 100 characters).' });
    }

    const user = {
      email,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      name,
      createdAt: new Date(),
    };
    try {
      const { insertedId } = await users.insertOne(user);
      user._id = insertedId;
    } catch (err) {
      // 11000 = duplicate key: the unique index on email caught an existing account.
      if (err.code === 11000) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      throw err;
    }

    setTokenCookie(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login  { email, password } -> 200 { user }
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email ?? '').trim().toLowerCase();
    const password = String(req.body.password ?? '');

    const user = await users.findOne({ email });
    // Same message whether the email or the password is wrong, so the response
    // doesn't reveal which emails have accounts.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    setTokenCookie(res, user);
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout -> 204
router.post('/logout', (req, res) => {
  res.clearCookie(TOKEN_COOKIE, cookieOptions);
  res.status(204).end();
});

// GET /api/auth/me -> 200 { user } | 401
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await users.findOne({ _id: new ObjectId(req.user.id) });
    // The token can outlive the account (e.g. the user was deleted from the database).
    if (!user) return res.status(401).json({ error: 'Not logged in.' });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
