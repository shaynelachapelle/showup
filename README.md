# Showup!

Campus-wide events platform for McGill clubs and orgs. COMP 307, Fall 2026.
(The graded submission README is `README.txt`.)

## Layout

```
client/                 React + Vite (JavaScript)
  index.html            HTML entry
  vite.config.js        Vite config (React plugin)
  src/main.jsx          React entry, mounts <App />
  src/App.jsx           starter page
  src/assets/           static assets imported by components
  public/               files served as-is
server/                 Express (ES modules)
  src/index.js          app entry, mounts routes, serves client/dist in prod
  src/db.js             shared MongoDB connection
  src/calendar.js       builds .ics files and Google Calendar links
  src/categories.js     category list shared by orgs and events
  src/seed.js           demo data
  src/routes/           auth, orgs, events, follows, rsvps, calendar
  src/middleware/       requireAuth, requireOrgAdmin, errorHandler
```

## Setup

Needs Node 20.19+ or 22.12+ (required by Vite 8) and a local MongoDB: install
[MongoDB Community Server](https://www.mongodb.com/try/download/community) and leave it running.
We host our own MongoDB (no Atlas).

```bash
npm install
```

```bash
cp server/.env.example server/.env
```

Fill in demo data. It refuses to run on a database that already has data; add `-- --reset` to wipe and reseed. Log in as `demo@mail.mcgill.ca` with the `SEED_PASSWORD` from `server/.env`.

```bash
npm run seed -w server
```

Client (http://localhost:5173):

```bash
npm run dev -w client
```

Server (http://localhost:3000), in a second terminal:

```bash
npm start -w server
```

Production (Express serves the built client on :3000):

```bash
npm run build -w client
```

```bash
npm start -w server
```

## Deployment

https://fall2026-comp307-group07.cs.mcgill.ca (McGill VPN or campus network only).
The group server's `server/.env` must have `COOKIE_SECURE=true` and a private `SEED_PASSWORD`.

To deploy `main`:

1. Save the group SSH key as `~/.ssh/cs307-group07-key` (first time only, on macOS/Linux also run `chmod 400` on it).
2. Connect to the McGill VPN, then log in to the server:

   ```bash
   ssh -i ~/.ssh/cs307-group07-key cs307-user@fall2026-comp307-group07.cs.mcgill.ca
   ```

   Without the VPN, add `-J <cs-username>@mimi.cs.mcgill.ca` right after `ssh` to go through Mimi.

3. On the server, run:

   ```bash
   cd ~/showup && git pull --ff-only && npm ci && npm run build -w client && systemctl --user restart showup
   ```

4. Type `exit` to log out. The app keeps running.

- Check `/api/health` when the app is down, nginx serves a placeholder page.

## Conventions

- Every source file starts with `// Author: <name>`

## Features and owners

| #   | Feature                                  | Owner |
| --- | ---------------------------------------- | ----- |
| 1   | Auth + landing + route protection        | TBD   |
| 2   | Orgs: CRUD, admins, follow/unfollow      | TBD   |
| 3   | Events: CRUD, cancel, RSVP with capacity | TBD   |
| 4   | My events: feed, list/calendar, .ics     | TBD   |
| 5   | Explore/search + map API                 | TBD   |
