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
  src/categories.js     category list shared by orgs and events
  src/seed.js           demo data
  src/routes/           auth, orgs, events, follows, rsvps, ics
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

Fill in demo data. It refuses to run on a database that already has data; add `-- --reset` to wipe and reseed. Log in as `demo@mail.mcgill.ca` / `showup-demo`.

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
