import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import mainRouter from "./routes";
import { initSocket } from "./socket";
import { startAutoResumeCron } from "./utils/corn/cronJobs";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true                
}));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1", mainRouter);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
initSocket(server); // 🔌 Initialize WebSocket server

async function main() {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB Connected Successfully!");

    startAutoResumeCron(); 

    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
}

main();