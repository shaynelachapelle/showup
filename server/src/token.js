// Author: Shayne Lachapelle
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not set. Copy server/.env.example to server/.env and fill it in.",
  );
}

export const TOKEN_COOKIE = "token";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// httpOnly: page JavaScript can't read the cookie, so an XSS bug can't steal the login.
// sameSite 'lax': the browser won't send it on cross-site form posts (basic CSRF protection).
// secure: HTTPS-only. Set by env var rather than detected, because nginx doesn't tell Express
// about HTTPS. Must stay off for plain HTTP, or browsers may drop the cookie.
export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.COOKIE_SECURE === "true",
};

export function setTokenCookie(res, user) {
  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: MAX_AGE_MS / 1000,
    },
  );
  res.cookie(TOKEN_COOKIE, token, { ...cookieOptions, maxAge: MAX_AGE_MS });
}

// Returns { id, email } for a valid, unexpired token; throws otherwise.
export function verifyToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return { id: payload.sub, email: payload.email };
}
