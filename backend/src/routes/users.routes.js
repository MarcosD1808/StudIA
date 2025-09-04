import { Router } from "express";
import pool from "../db/pool.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/users/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [userId]
    );
    const me = rows[0];
    if (!me) {
      return res.status(404).json({ ok: false, error: { code: "USER_NOT_FOUND", message: "Usuario no encontrado" } });
    }
    return res.json({ ok: true, data: me });
  } catch (err) {
    console.error("GET /users/me ERROR:", err);
    return res.status(500).json({ ok: false, error: { code: "SERVER_ERROR", message: "Error interno" } });
  }
});

export default router;
