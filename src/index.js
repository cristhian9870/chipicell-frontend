import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import tasksRoutes from "./routes/tasks.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();
app.use(express.json());

// Allow configuring one or more frontend origins via env var (useful for deployments)
// FRONTEND_URLS can be a comma-separated list, e.g. "http://localhost:5173,http://localhost:3000"
const defaultFrontend = process.env.FRONTEND_URL || "http://localhost:5173";
const FRONTEND_URLS = (process.env.FRONTEND_URLS || defaultFrontend)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools like curl/postman (no origin)
      if (!origin) return callback(null, true);
      // in development allow all
      if (process.env.NODE_ENV !== "production") return callback(null, true);
      if (FRONTEND_URLS.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);
console.log(`Allowed CORS origins: ${FRONTEND_URLS.join(', ')}`);

app.use(cookieParser());

// Prueba
app.get("/", (req, res) => {
  res.send("Hello World");
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", verifyToken, tasksRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Serve frontend static build if available. Configure with FRONTEND_BUILD_PATH env var
const buildPath = process.env.FRONTEND_BUILD_PATH || path.join(process.cwd(), "public");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  // SPA fallback: any non-API route returns index.html
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  console.log(`Frontend build not found at ${buildPath}. To serve the frontend, set FRONTEND_BUILD_PATH or copy your build to ./public`);
}
