import  express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import mainRouter from "./routes";
import "./utils/corn/cronJobs";
import { startAutoResumeCron } from "./utils/corn/cronJobs";
import { autoResumePausedPlans } from "./utils/corn/autoresume";
const app= express();
dotenv.config();
const PORT=process.env.PORT;
app.use(express.json())
app.use("/api/v1", mainRouter); 

async function main() {
    try{
        if(!process.env.MONGODB_URL){
            throw new Error("MONGODB_URL is not defined in .env file");
        }

        await mongoose.connect(process.env.MONGODB_URL);
        console.log(" MongoDB Connected Successfully!");
        // Start cron jobs
        startAutoResumeCron();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1);
  }
}
main();
export default app;