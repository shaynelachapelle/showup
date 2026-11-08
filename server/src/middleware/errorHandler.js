// Author: Shayne Lachapelle
// Express only treats middleware as an error handler if it takes all 4 arguments,
// so `next` must stay even though it's unused.
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
}
