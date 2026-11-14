// Author: Shayne Lachapelle
import { TOKEN_COOKIE, verifyToken } from '../token.js';

// Rejects requests without a valid login cookie. On success, sets req.user = { id, email }.
export function requireAuth(req, res, next) {
  try {
    req.user = verifyToken(req.cookies[TOKEN_COOKIE]);
    next();
  } catch {
    res.status(401).json({ error: 'Not logged in.' });
  }
}
