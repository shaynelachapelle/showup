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
}
