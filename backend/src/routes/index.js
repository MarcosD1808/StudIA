// backend/src/routes/index.js
import { Router } from "express";
import pool from "../db/pool.js";           // <- usa SIEMPRE el mismo pool
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";

const router = Router();

// Salud DB (queda acá porque es endpoint "core" del servicio)
router.get("/api/db-check", async (_req, res) => {
  const t0 = Date.now();
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, data: { status: "up", latencyMs: Date.now() - t0 } });
  } catch (err) {
    res.status(503).json({
      ok: false,
      error: { code: "DB_UNAVAILABLE", detail: err.message },
    });
  }
});

// Montar sub-routers modulados
router.use("/api", authRoutes);   // /api/auth/...
router.use("/api", usersRoutes);  // /api/users/...

export default router;
