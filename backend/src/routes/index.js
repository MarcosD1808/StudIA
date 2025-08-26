import { Router } from "express";
import pool from "../db/db.js";
import bcrypt from "bcrypt";

const router = Router();

// Salud DB
router.get("/db-check", async (_req, res) => {
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

// Crear usuario
router.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        error: { code: "VALIDATION_ERROR", message: "name, email y password son requeridos" },
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `insert into users (name, email, password_hash)
       values ($1, $2, $3)
       on conflict (email) do nothing
       returning id, name, email, role, created_at`,
      [name, email, password_hash]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({
        ok: false,
        error: { code: "USER_EXISTS", message: "El email ya está registrado" },
      });
    }

    return res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error creando usuario:", err);
    return res.status(500).json({
      ok: false,
      error: { code: "SERVER_ERROR", message: "Error interno del servidor" },
    });
  }
});

// *** LOGIN AQUÍ, ANTES DEL EXPORT Y SIN 404 QUE LO BLOQUEE ***
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: { code: "VALIDATION_ERROR", message: "email y password son requeridos" },
      });
    }

    const result = await pool.query(
      `select id, name, email, role, password_hash
       from users
       where email = $1
       limit 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        error: { code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" },
      });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash || "");
    if (!isValid) {
      return res.status(401).json({
        ok: false,
        error: { code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" },
      });
    }

    const { password_hash, ...publicUser } = user;
    return res.json({ ok: true, data: { user: publicUser } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      ok: false,
      error: { code: "SERVER_ERROR", message: "Error interno del servidor" },
    });
  }
});

export default router;
