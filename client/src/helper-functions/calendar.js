// Author: Shayne Lachapelle
import { ApiError } from "../api/client.js";

// Fetches an .ics file and saves it. A plain link would save the server's JSON error
// as a broken .ics instead, so errors are thrown with the server's message.
export async function downloadIcs(path, filename) {
  const res = await fetch(path);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, data?.error ?? `Request failed (${res.status})`);
  }

  const url = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Freed on the next tick, once the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url));
}
