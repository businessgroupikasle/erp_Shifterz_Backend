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
// Load environment variables (updated to 127.0.0.1 for local postgres connectivity)
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
// Start Server
app.listen(PORT, async () => {
    console.log(`Shifterz backend running on port ${PORT}`);
});
// Restart trigger - edit and delete transfer request endpoints loaded
//# sourceMappingURL=index.js.map