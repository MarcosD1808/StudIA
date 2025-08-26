import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import indexRoutes from "./routes/index.js";   // único router base /api

dotenv.config(); // carga backend/.env

const app = express();
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

// Rutas (solo /api con todo adentro, incluido /auth/login)
app.use('/api', indexRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

// 404 global al final
app.use((req, res) => {
  res.status(404).json({
    ok:false,
    error:{ code:'NOT_FOUND', message:`No existe ${req.method} ${req.originalUrl}` }
  });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});