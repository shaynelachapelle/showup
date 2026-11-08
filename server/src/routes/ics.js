// Author: Shayne Lachapelle
import { Router } from 'express';

const router = Router();
const notImplemented = (req, res) => res.status(501).json({ error: 'Not implemented' });

router.get('/:token', notImplemented);

export default router;
