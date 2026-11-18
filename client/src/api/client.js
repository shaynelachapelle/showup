// Author: Shayne Lachapelle
// Small wrapper around fetch for our API. Sends and parses JSON, and throws an ApiError
// with the server's message for any non-2xx response

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(method, path, body) {
  const res = await fetch(path, {
    method,
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // 204 (e.g. logout) has no body.
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      res.status,
      data?.error ?? `Request failed (${res.status})`,
    );
  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};
