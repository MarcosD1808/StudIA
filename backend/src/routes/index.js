import { Router } from "express";
import { pool } from "../db/pool.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.get("/env-check", (_req, res) => {
  const hasDb = !!process.env.DATABASE_URL;
  res.json({ envLoaded: true, hasDatabaseUrl: hasDb });
});

// versión simple para aislar conexión
router.get("/db-check", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT 1 AS ok");
    res.json({ db: "ok", probe: rows[0].ok });
  } catch (e) {
    console.error("DB error:", e);
    res.status(500).json({ error: "DB error", details: e.message });
  }
});