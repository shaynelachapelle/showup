// Author: Shayne Lachapelle
import { Router } from 'express';

const router = Router();
const notImplemented = (req, res) => res.status(501).json({ error: 'Not implemented' });

router.get('/', notImplemented);
router.get('/feed', notImplemented);
router.get('/:eventId', notImplemented);
router.post('/', notImplemented);
router.patch('/:eventId', notImplemented);
router.post('/:eventId/cancel', notImplemented);
router.delete('/:eventId', notImplemented);

export default router;
