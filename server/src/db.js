// Author: Shayne Lachapelle
import { MongoClient } from 'mongodb';

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not set. Copy server/.env.example to server/.env and fill it in.');
}

const client = new MongoClient(process.env.MONGO_URI);

// One shared database handle for all routes. The database name comes from MONGO_URI.
export const db = client.db();

// Called once at startup so the server fails fast if MongoDB is unreachable or the login is wrong.
export async function connectDb() {
  await client.connect();
  await db.command({ ping: 1 });

  // createIndex does nothing if the index already exists, so this is safe on every start.
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('orgs').createIndex({ slug: 1 }, { unique: true });
  // One RSVP per user per event; also makes "my RSVPs" lookups fast.
  await db.collection('rsvps').createIndex({ userId: 1, eventId: 1 }, { unique: true });
  // Fast lookups of an event's RSVPs
  await db.collection('rsvps').createIndex({ eventId: 1 });
}
