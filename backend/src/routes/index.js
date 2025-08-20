import { Router } from 'express';
import pool from '../db/db.js';

const router = Router();

router.get('/db-check', async (_req, res) => {
  const t0 = Date.now();
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, data: { status: 'up', latencyMs: Date.now() - t0 } });
  } catch (err) {
    res.status(503).json({ ok: false, error: { code: 'DB_UNAVAILABLE', detail: err.message } });
  }
});

export default router;