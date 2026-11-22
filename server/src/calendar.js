// Author: Shayne Lachapelle
// Turns events into .ics files and "Add to Google Calendar" links.

const ONE_HOUR_MS = 60 * 60 * 1000;

// UTC in calendar format: 20261204T180000Z
const formatDate = (date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");

// Calendar dates need four-digit years. 9999 is excluded so adding an hour can't overflow.
export const canExportDate = (date) =>
  date.getUTCFullYear() >= 1000 && date.getUTCFullYear() < 9999;

// Events without a usable end time are treated as one hour long.
const getEnd = ({ start, end }) =>
  end > start && canExportDate(end)
    ? end
    : new Date(start.getTime() + ONE_HOUR_MS);

const getLocation = ({ location }) =>
  [location?.name, location?.address].filter(Boolean).join(", ");

// Event text is user input: without escaping, a line break could inject calendar fields.
const escapeText = (value) =>
  String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/[;,]/g, "\\$&")
    .replace(/\r\n|\r|\n/g, "\\n");

// The format limits lines to 75 bytes. Longer ones continue on a new line starting with a space.
function foldLine(line) {
  let folded = "";
  let bytes = 0;
  for (const char of line) {
    const size = Buffer.byteLength(char);
    if (bytes + size > 75) {
      folded += "\r\n ";
      bytes = 1;
    }
    folded += char;
    bytes += size;
  }
  return folded;
}

export function buildIcs(events) {
  const now = formatDate(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Showup//COMP 307//EN",
    "CALSCALE:GREGORIAN",
    ...events.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:${event._id}@showup`,
      `DTSTAMP:${now}`,
      `DTSTART:${formatDate(event.start)}`,
      `DTEND:${formatDate(getEnd(event))}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
      `LOCATION:${escapeText(getLocation(event))}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

function truncate(value, maxBytes) {
  const text = String(value ?? "");
  const bytes = Buffer.from(text);
  if (bytes.length <= maxBytes) return text;
  // The replace drops a character that was cut in half.
  return (
    bytes
      .subarray(0, maxBytes)
      .toString()
      .replace(/\uFFFD+$/, "") + "…"
  );
}

export function buildGoogleCalendarUrl(event) {
  // Text is truncated because the URL goes in a redirect header, and nginx fails over 4 KB.
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: truncate(event.title, 150),
    dates: `${formatDate(event.start)}/${formatDate(getEnd(event))}`,
    details: truncate(event.description, 500),
    location: truncate(getLocation(event), 200),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
