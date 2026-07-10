import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { apiRouter } from "./routes/api.js";
import { hqRouter } from "./routes/hq.js";
import { dashboardRouter } from "./routes/dashboard.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Routes
app.use("/api", apiRouter);
app.use("/api/hq", hqRouter);
app.use("/api/dashboard", dashboardRouter);

// Basic health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

import { exec } from "child_process";

// Start Server
app.listen(PORT, async () => {
  console.log(`Shifterz backend running on port ${PORT}`);
  
  // Automigrate & regenerate Prisma client on startup
  console.log("[Auto-Migration] Running npx prisma db push...");
  exec("npx prisma db push", (err, stdout, stderr) => {
    if (err) {
      console.error("[Auto-Migration] Failed to migrate database:", err);
    } else {
      console.log("[Auto-Migration] Database migrated and generated successfully:", stdout);
    }
  });
});

// Restart trigger: prisma schema model updated to UserPermission relations table v2
