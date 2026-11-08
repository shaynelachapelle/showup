// Author: Shayne Lachapelle
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import orgRoutes from './routes/orgs.js';
import eventRoutes from './routes/events.js';
import followRoutes from './routes/follows.js';
import rsvpRoutes from './routes/rsvps.js';
import icsRoutes from './routes/ics.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/rsvps', rsvpRoutes);
app.use('/ics', icsRoutes); // outside /api: calendar apps fetch it without a login cookie

// Serve the built React app. Any other non-API path returns index.html
// so React Router can handle it in the browser.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get(/^\/(?!api\/|ics\/).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Showup! server on http://localhost:${port}`));
