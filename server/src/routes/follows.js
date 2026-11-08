// Author: Shayne Lachapelle
import { Router } from 'express';

const router = Router();
const notImplemented = (req, res) => res.status(501).json({ error: 'Not implemented' });

router.get('/', notImplemented);
router.post('/:orgId', notImplemented);
router.delete('/:orgId', notImplemented);

export default router;
