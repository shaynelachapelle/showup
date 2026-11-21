// Author: Shayne Lachapelle
// Fills the database with demo users, orgs, events, follows and RSVPs.
//   npm run seed -w server               (only runs on an empty database)
//   npm run seed -w server -- --reset    (wipes the Showup! collections first)

import "dotenv/config";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { db, connectDb } from "./db.js";

// Every seeded account uses this password. The demo login is demo@mail.mcgill.ca.
const SEED_PASSWORD = "showup-demo";

const COLLECTIONS = ["users", "orgs", "events", "follows", "rsvps"];

const users = {
  demo: { name: "Demo Student", email: "demo@mail.mcgill.ca" },
  alex: { name: "Alex Tremblay", email: "alex.demo@mail.mcgill.ca" },
  priya: { name: "Priya Sharma", email: "priya.demo@mail.mcgill.ca" },
  marc: { name: "Marc Gagnon", email: "marc.demo@mail.mcgill.ca" },
  jordan: { name: "Jordan Lee", email: "jordan.demo@mail.mcgill.ca" },
};

const orgs = {
  climbing: {
    name: "McGill Climbing Club",
    category: "Athletics and Recreation",
    description:
      "A beginner-friendly climbing community with weekly sessions, trips and a competition team.",
    links: { instagram: "https://www.instagram.com/mcgillclimbing/" },
    admins: ["demo"],
  },
  outdoors: {
    name: "McGill Students' Outdoors Club",
    category: "Athletics and Recreation",
    description:
      "Hiking, camping and outdoor trips for every experience level, running since 1936.",
    links: {
      website: "https://mcgilloutdoorsclub.ca/",
      instagram: "https://www.instagram.com/mcgilloutdoorsclub/",
    },
    admins: ["alex"],
  },
  mealcare: {
    name: "MealCare",
    category: "Charity and Environment",
    description:
      "Volunteers who rescue surplus campus food and deliver it to local food banks.",
    links: {
      website: "https://mealcare.org/",
      instagram: "https://www.instagram.com/mealcare_mcgill/",
    },
    admins: ["priya"],
  },
  forests: {
    name: "Little Forests McGill",
    category: "Charity and Environment",
    description:
      "Planting small, dense native forests around Montreal using the Miyawaki method.",
    links: {
      website: "https://linktr.ee/littleforestsmcg",
      instagram: "https://www.instagram.com/littleforestsmcgill/",
    },
    admins: ["priya"],
  },
  players: {
    name: "Players' Theatre",
    category: "Fine Arts, Dance and Performance",
    description:
      "A student-run theatre company putting on affordable productions every semester.",
    links: {
      website: "https://www.playerstheatre.ca/",
      instagram: "https://www.instagram.com/playerstheatremcgill/",
    },
    admins: ["marc"],
  },
  comedy: {
    name: "McGill Students' Comedy Club",
    category: "Fine Arts, Dance and Performance",
    description:
      "Stand-up and improv workshops, plus a live comedy show every month.",
    links: { instagram: "https://instagram.com/mcgillcomedy" },
    admins: ["marc"],
  },
  lotus: {
    name: "Lotus Initiative",
    category: "Health and Wellness",
    description:
      "Free and low-cost fitness classes and mental-health workshops for students.",
    links: { instagram: "https://instagram.com/lotusinitiative.mcgill" },
    admins: ["jordan"],
  },
  meditation: {
    name: "The Meditation Club",
    category: "Health and Wellness",
    description:
      "Guided sessions and discussions on the practice and theory of meditation.",
    links: {
      instagram: "https://www.instagram.com/the_mcgill_meditation_club/",
    },
    admins: ["demo"],
  },
};

// Coordinates are approximate, for the event map.
const places = {
  universityCentre: {
    name: "University Centre (SSMU Building)",
    address: "3480 McTavish St, Montreal, QC",
    lat: 45.5034,
    lng: -73.5785,
  },
  playersTheatre: {
    name: "Players' Theatre, University Centre",
    address: "3480 McTavish St, Montreal, QC",
    lat: 45.5034,
    lng: -73.5785,
  },
  gerts: {
    name: "Gerts Bar, University Centre",
    address: "3480 McTavish St, Montreal, QC",
    lat: 45.5034,
    lng: -73.5785,
  },
  leacock: {
    name: "Leacock Building",
    address: "855 Sherbrooke St W, Montreal, QC",
    lat: 45.5043,
    lng: -73.5757,
  },
  trottier: {
    name: "Trottier Building",
    address: "3630 University St, Montreal, QC",
    lat: 45.507,
    lng: -73.5786,
  },
  sportsCentre: {
    name: "McGill Sports Centre",
    address: "475 Pine Ave W, Montreal, QC",
    lat: 45.5093,
    lng: -73.5793,
  },
  roddickGates: {
    name: "Roddick Gates",
    address: "845 Sherbrooke St W, Montreal, QC",
    lat: 45.5045,
    lng: -73.575,
  },
  mountRoyal: {
    name: "Mount Royal Chalet",
    address: "1196 Voie Camillien-Houde, Montreal, QC",
    lat: 45.5034,
    lng: -73.5873,
  },
  allezUp: {
    name: "Allez-Up Climbing Gym",
    address: "1555 Rue Saint-Patrick, Montreal, QC",
    lat: 45.4855,
    lng: -73.5625,
  },
};

// [key, org, title, description, days from today, start "HH:MM", hours long, place, options]
// Options: capacity (default null = unlimited), cost in dollars (default 0 = free), status.
const events = [
  [
    "bouldering",
    "climbing",
    "Intro to Bouldering Night",
    "Learn the basics of bouldering with experienced members. Shoes included.",
    2,
    "18:00",
    2,
    "allezUp",
    { capacity: 3, cost: 15 },
  ],
  [
    "tryouts",
    "climbing",
    "Competition Team Tryouts",
    "Show us your best routes and join the competition team.",
    9,
    "17:00",
    3,
    "allezUp",
    { capacity: 20 },
  ],
  [
    "boulderSocial",
    "climbing",
    "Fall Bouldering Social",
    "A relaxed night of climbing and snacks.",
    -5,
    "19:00",
    2,
    "allezUp",
    { cost: 10 },
  ],
  [
    "sunsetHike",
    "outdoors",
    "Mount Royal Sunset Hike",
    "An easy group hike up to the lookout to watch the sunset.",
    3,
    "16:00",
    2,
    "mountRoyal",
    {},
  ],
  [
    "campingPrep",
    "outdoors",
    "Winter Camping Prep Workshop",
    "Gear, layering and safety tips before winter trip season.",
    11,
    "18:30",
    1.5,
    "leacock",
    { capacity: 40 },
  ],
  [
    "tremblant",
    "outdoors",
    "Day Trip: Mont-Tremblant Hike",
    "Bus up north for a full-day hike. Lunch not included.",
    16,
    "07:00",
    11,
    "roddickGates",
    { capacity: 25, cost: 35 },
  ],
  [
    "orientation",
    "mealcare",
    "Food Recovery Volunteer Orientation",
    "How our pickups and deliveries work, and how to sign up for shifts.",
    4,
    "17:30",
    1.5,
    "universityCentre",
    { capacity: 30 },
  ],
  [
    "mealPrep",
    "mealcare",
    "Community Meal Prep Shift",
    "Cook rescued food into meals for a local shelter.",
    10,
    "10:00",
    3,
    "universityCentre",
    { capacity: 12 },
  ],
  [
    "potluck",
    "mealcare",
    "Zero-Waste Potluck",
    "Bring a dish in a reusable container and meet the team.",
    18,
    "18:00",
    2,
    "universityCentre",
    {},
  ],
  [
    "planting",
    "forests",
    "Tree Planting Info Session",
    "What a Miyawaki forest is and how to help plant our next one.",
    5,
    "17:00",
    1,
    "leacock",
    {},
  ],
  [
    "seedWalk",
    "forests",
    "Seed Collection Walk on Mount Royal",
    "Collect native seeds for next spring. Cancelled due to weather.",
    12,
    "13:00",
    2,
    "mountRoyal",
    { capacity: 15, status: "cancelled" },
  ],
  [
    "opening",
    "players",
    "Fall Mainstage: Opening Night",
    "Opening night of our fall mainstage production.",
    6,
    "19:30",
    2.5,
    "playersTheatre",
    { capacity: 120, cost: 12 },
  ],
  [
    "closing",
    "players",
    "Fall Mainstage: Closing Night",
    "Last chance to catch the fall mainstage production.",
    8,
    "19:30",
    2.5,
    "playersTheatre",
    { capacity: 120, cost: 12 },
  ],
  [
    "auditions",
    "players",
    "Open Auditions: Winter Show",
    "No experience needed. Prepare a short monologue.",
    20,
    "18:00",
    3,
    "playersTheatre",
    {},
  ],
  [
    "standup",
    "comedy",
    "Monthly Stand-Up Showcase",
    "Student comics try out their best five minutes.",
    7,
    "20:00",
    2,
    "gerts",
    { capacity: 80, cost: 5 },
  ],
  [
    "standupWorkshop",
    "comedy",
    "Beginner Stand-Up Workshop",
    "Write and workshop your first set in a friendly room.",
    13,
    "18:00",
    2,
    "leacock",
    { capacity: 20 },
  ],
  [
    "improvJam",
    "comedy",
    "Improv Jam",
    "Drop-in improv games for all levels.",
    -2,
    "19:00",
    2,
    "leacock",
    {},
  ],
  [
    "hiit",
    "lotus",
    "Free HIIT Class",
    "A 45-minute high-intensity workout. Bring water.",
    1,
    "17:00",
    1,
    "sportsCentre",
    { capacity: 30 },
  ],
  [
    "examYoga",
    "lotus",
    "Yoga for Exam Season",
    "Gentle yoga to unwind between exams. Mats provided.",
    14,
    "12:00",
    1,
    "sportsCentre",
    { capacity: 25 },
  ],
  [
    "stressLess",
    "lotus",
    "Stress Less: Mental Health Workshop",
    "Practical strategies for managing stress during finals.",
    15,
    "17:00",
    1.5,
    "leacock",
    { capacity: 50 },
  ],
  [
    "guided1",
    "meditation",
    "Weekly Guided Meditation",
    "A 45-minute guided session. Beginners welcome.",
    1,
    "12:30",
    0.75,
    "trottier",
    {},
  ],
  [
    "guided2",
    "meditation",
    "Weekly Guided Meditation",
    "A 45-minute guided session. Beginners welcome.",
    8,
    "12:30",
    0.75,
    "trottier",
    {},
  ],
  [
    "silentMorning",
    "meditation",
    "Silent Meditation Morning",
    "Two hours of silent sitting and walking meditation.",
    17,
    "09:00",
    2,
    "trottier",
    { capacity: 20 },
  ],
  [
    "mindfulness",
    "meditation",
    "Mindfulness 101",
    "An introduction to mindfulness and how to build a habit.",
    22,
    "17:00",
    1,
    "trottier",
    {},
  ],
];

const follows = {
  demo: ["climbing", "outdoors", "mealcare", "players", "meditation"],
  alex: ["climbing", "outdoors", "comedy"],
  priya: ["mealcare", "forests", "lotus", "climbing"],
  marc: ["players", "comedy", "meditation"],
  jordan: ["lotus", "meditation", "outdoors", "players"],
};

// 'bouldering' is filled to capacity by others, so the demo user can test a full event.
// The demo user is going to a cancelled event (seedWalk) and a past one (boulderSocial).
const rsvps = {
  demo: [
    "sunsetHike",
    "opening",
    "guided1",
    "orientation",
    "seedWalk",
    "boulderSocial",
  ],
  alex: ["bouldering", "sunsetHike", "tremblant"],
  priya: ["bouldering", "mealPrep", "potluck"],
  marc: ["opening", "standup", "improvJam"],
  jordan: ["bouldering", "hiit", "examYoga"],
};

function dateAt(daysFromToday, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function seed() {
  await connectDb();

  let hasData = false;
  for (const name of COLLECTIONS) {
    if (await db.collection(name).countDocuments({}, { limit: 1 }))
      hasData = true;
  }
  if (hasData && !process.argv.includes("--reset")) {
    console.error(
      `Database "${db.databaseName}" already has data. To wipe it and reseed, run:`,
    );
    console.error("  npm run seed -w server -- --reset");
    process.exit(1);
  }
  // deleteMany instead of drop keeps the indexes (e.g. the unique email index).
  for (const name of COLLECTIONS) await db.collection(name).deleteMany({});

  const now = new Date();
  const ids = { users: {}, orgs: {}, events: {} };
  for (const key of Object.keys(users)) ids.users[key] = new ObjectId();
  for (const key of Object.keys(orgs)) ids.orgs[key] = new ObjectId();
  for (const [key] of events) ids.events[key] = new ObjectId();

  // Counters are computed from the follow/RSVP lists so they always match.
  const followerCount = {};
  for (const keys of Object.values(follows))
    for (const k of keys) followerCount[k] = (followerCount[k] ?? 0) + 1;
  const goingCount = {};
  for (const keys of Object.values(rsvps))
    for (const k of keys) goingCount[k] = (goingCount[k] ?? 0) + 1;

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  await db.collection("users").insertMany(
    Object.entries(users).map(([key, u]) => ({
      _id: ids.users[key],
      ...u,
      passwordHash,
      createdAt: now,
    })),
  );

  await db.collection("orgs").insertMany(
    Object.entries(orgs).map(([key, o]) => ({
      _id: ids.orgs[key],
      name: o.name,
      slug: slugify(o.name),
      description: o.description,
      logoUrl: null,
      category: o.category,
      links: o.links,
      admins: o.admins.map((u) => ids.users[u]),
      followerCount: followerCount[key] ?? 0,
      createdAt: now,
    })),
  );

  await db.collection("events").insertMany(
    events.map(
      ([key, org, title, description, days, time, hours, place, opts]) => {
        const start = dateAt(days, time);
        const capacity = opts.capacity ?? null;
        if (capacity !== null && (goingCount[key] ?? 0) > capacity) {
          throw new Error(
            `Seed data error: "${title}" has more RSVPs than its capacity.`,
          );
        }
        return {
          _id: ids.events[key],
          orgId: ids.orgs[org],
          title,
          description,
          category: orgs[org].category,
          start,
          end: new Date(start.getTime() + hours * 60 * 60 * 1000),
          location: places[place],
          capacity,
          goingCount: goingCount[key] ?? 0,
          cost: opts.cost ?? 0,
          imageUrl: null,
          status: opts.status ?? "active",
          createdBy: ids.users[orgs[org].admins[0]],
          createdAt: now,
        };
      },
    ),
  );

  await db.collection("follows").insertMany(
    Object.entries(follows).flatMap(([user, keys]) =>
      keys.map((org) => ({
        userId: ids.users[user],
        orgId: ids.orgs[org],
        createdAt: now,
      })),
    ),
  );

  await db.collection("rsvps").insertMany(
    Object.entries(rsvps).flatMap(([user, keys]) =>
      keys.map((event) => ({
        userId: ids.users[user],
        eventId: ids.events[event],
        createdAt: now,
      })),
    ),
  );

  for (const name of COLLECTIONS) {
    console.log(
      `${name.padEnd(8)} ${await db.collection(name).countDocuments()}`,
    );
  }
  console.log(
    `\nSeeded "${db.databaseName}". Log in as ${users.demo.email} / ${SEED_PASSWORD}`,
  );
}

try {
  await seed();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
