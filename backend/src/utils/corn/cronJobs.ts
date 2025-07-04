import cron from "node-cron";
import { autoResumePausedPlans } from "./autoresume";
export const startAutoResumeCron = () => {
  // Run every day at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    console.log("Running auto-resume cron job...");
    try {
      const result = await autoResumePausedPlans();
      console.log(result.message);
    } catch (err) {
      console.error("Error in auto-resume cron:", err);
    }
  });
};
