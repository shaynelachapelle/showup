// Author: Shayne Lachapelle
import { Router } from 'express';

const router = Router();
const notImplemented = (req, res) => res.status(501).json({ error: 'Not implemented' });

router.get('/', notImplemented);
router.post('/:eventId', notImplemented);
router.delete('/:eventId', notImplemented);

export default router;
