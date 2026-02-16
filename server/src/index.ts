import "reflect-metadata";
import express from "express";
import http from "http";
import "./core/di/container"; 
import authRoutes from "./routes/auth.Routes";
import bookmarkRoutes from "./routes/bookmark.Routes";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import { initSocket } from "./lib/socket";

dotenv.config()
const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
connectDB()
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
initSocket(server, allowedOrigins);

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
