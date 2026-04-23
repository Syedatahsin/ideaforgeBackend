import cors from 'cors';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import router from './routes';



dotenv.config();

const app: Application = express();

/* 🔥 FIX 1: REQUIRED FOR VERCEL + OAUTH COOKIES */
app.set("trust proxy", 1);

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  process.env.APP_URL,
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
}));

// --- BODY PARSERS ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("ideaforge API is running...");
});

// --- BETTER AUTH HANDLER ---
// Must come BEFORE /api router to handle /api/auth requests correctly
app.all("/api/auth/*splat", toNodeHandler(auth));

// --- ROUTES ---
app.use('/api', router);

// --- ERROR HANDLING ---
app.use(notFound);
app.use(globalErrorHandler);

export default app;
