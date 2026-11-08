// Author: Shayne Lachapelle
import { Router } from 'express';

const router = Router();
const notImplemented = (req, res) => res.status(501).json({ error: 'Not implemented' });

router.get('/', notImplemented);
router.get('/mine', notImplemented);
router.get('/:slug', notImplemented);
router.post('/', notImplemented);
router.patch('/:orgId', notImplemented);
router.delete('/:orgId', notImplemented);
router.post('/:orgId/admins', notImplemented);
router.delete('/:orgId/admins/:userId', notImplemented);

export default router;
