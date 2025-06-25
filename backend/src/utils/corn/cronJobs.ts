import cron from "node-cron";
import { SubscriptionPlanModel } from "../../model/subcriptionPlan";


cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  const plans = await SubscriptionPlanModel.find({ isActive: true });

  for (const plan of plans) {
    const expirationDate = new Date(plan.createdAt);
    expirationDate.setDate(expirationDate.getDate() + plan.durationDays);

    if (now > expirationDate) {
      plan.isActive = false;
      await plan.save();
      console.log(`Deactivated expired plan: ${plan.name}`);
    }
  }

  console.log("Checked for expired plans at midnight.");
});
