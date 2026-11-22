// Author: Shayne Lachapelle
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { connectDb } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/requireAuth.js";
import authRoutes from "./routes/auth.js";
import orgRoutes from "./routes/orgs.js";
import eventRoutes from "./routes/events.js";
import followRoutes from "./routes/follows.js";
import rsvpRoutes from "./routes/rsvps.js";
import icsRoutes from "./routes/ics.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);

// Everything below requires a login. Handlers can rely on req.user = { id, email }.
app.use("/api/orgs", requireAuth, orgRoutes);
app.use("/api/events", requireAuth, eventRoutes);
app.use("/api/follows", requireAuth, followRoutes);
app.use("/api/events", requireAuth, rsvpRoutes);

app.use("/ics", icsRoutes);

// Serve the built React app. Any other non-API path returns index.html
// so React Router can handle it in the browser.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get(/^\/(?!api\/|ics\/).*/, (req, res) =>
  res.sendFile(path.join(clientDist, "index.html")),
);

app.use(errorHandler);

const port = process.env.PORT || 3000;
await connectDb();
// Loopback only, so nginx (HTTPS) is the only way in on the server.
// Both addresses, because "localhost" can resolve to either one.
for (const host of ["127.0.0.1", "::1"]) {
  app.listen(port, host, () =>
    console.log(`Showup! server listening on ${host} port ${port}`),
  );
}
