import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import cors from "cors";
import connectDB from "./db/connectDB.js";

import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import Cloudinary from "./src/utils/cloudinary.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://campus-connect-app.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/chatbot", chatRoutes);

// 🧩 Connect MongoDB safely
if (process.env.NODE_ENV !== 'production') {
  connectDB();
}
Cloudinary();


app.get("/", (req, res) => res.send("✅ API is working fine on Vercel"));

// Wrap all routes with a DB connection middleware for production
if (process.env.NODE_ENV === 'production') {
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: "Database connection failed" });
    }
  });
}

app.use("/user", userRoutes);
app.use("/company", companyRoutes);
app.use("/job", jobRoutes);
app.use("/recommendation", recommendationRoutes);
app.use("/notification", notificationRoutes);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
