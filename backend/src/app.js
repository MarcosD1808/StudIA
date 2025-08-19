import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { router } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Rutas
app.use("/api", router);

// Ruta raíz opcional
app.get("/", (_req, res) => res.send("API OK ✅ — probá /api/health"));

// Manejo de errores
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Error" });
});