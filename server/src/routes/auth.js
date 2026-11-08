// Author: Shayne Lachapelle
import { Router } from 'express';

const router = Router();
const notImplemented = (req, res) => res.status(501).json({ error: 'Not implemented' });

router.post('/register', notImplemented);
router.post('/login', notImplemented);
router.post('/logout', notImplemented);
router.get('/me', notImplemented);

export default router;
