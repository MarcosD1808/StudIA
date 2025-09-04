import { verifyToken } from "../services/jwt.services.js";

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [scheme, token] = auth.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        ok: false,
        error: { code: "NO_TOKEN", message: "Falta header Authorization Bearer" },
      });
    }

    const payload = verifyToken(token); // { sub, email, role, iat, exp }
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      error: { code: "INVALID_TOKEN", message: "Token inválido o vencido" },
    });
  }
}