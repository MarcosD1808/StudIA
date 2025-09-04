import { Router } from "express";
import pool from "../db/pool.js";
import bcrypt from "bcrypt";
import { signToken } from "../services/jwt.services.js";  // 👈 usa servicio centralizado

const router = Router();

// Salud rápida del router (para verificar montaje)
router.get("/ping", (_req, res) => {
  res.json({ ok: true, data: "auth ok" });
});

/**
 * POST /api/auth/login
 * Lee email y password, verifica con bcrypt y emite JWT.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      error: { code: "BAD_REQUEST", message: "email y password son requeridos" },
    });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, email, name, role, password_hash
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({
        ok: false,
        error: { code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" },
      });
    }

    const okPass = await bcrypt.compare(password, user.password_hash || "");
    if (!okPass) {
      return res.status(401).json({
        ok: false,
        error: { code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" },
      });
    }

    // Firmar JWT con datos mínimos
    const token = signToken({ sub: user.id, email: user.email, role: user.role });

    return res.json({
      ok: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: { code: "SERVER_ERROR", message: "Error interno" },
    });
  }
});

export default router;
