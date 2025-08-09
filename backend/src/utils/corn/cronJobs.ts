import cron from "node-cron";
import { autoResumePausedPlans } from "./autoresume";
export const startAutoResumeCron = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            await autoResumePausedPlans();
            console.log("⏰ Auto-resume cron executed");
        } catch {
            // silent
        }
    });
};
