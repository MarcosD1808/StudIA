import { Router } from "express";
import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    return res
      .status(400)
      .json({ ok: false, error: { code: "BAD_REQUEST", message: "email y password son requeridos" } });
  }

  try {
    // Ajustá el nombre de la tabla/columnas si tu esquema difiere
    const { rows } = await pool.query(
      `SELECT id, email, name, password_hash
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    const user = rows[0];
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, error: { code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" } });
    }

    const okPass = await bcrypt.compare(password, user.password_hash || "");
    if (!okPass) {
      return res
        .status(401)
        .json({ ok: false, error: { code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" } });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET || "dev_secret_change_me",
      { expiresIn: "2h" }
    );

    return res.json({
      ok: true,
      data: { token, user: { id: user.id, email: user.email, name: user.name } },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ ok: false, error: { code: "SERVER_ERROR", message: "Error interno" } });
  }
});

export default router;
