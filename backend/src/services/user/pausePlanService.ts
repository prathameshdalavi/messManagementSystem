import { PurchasedPlanModel } from "../../model/purchasedPlan";
import { SubscriptionPlanModel } from "../../model/subcriptionPlan";
import { userModel } from "../../model/user";

interface PauseEntry {
  startDate: Date;
  daysforthatPause: number;
  reason: string;
}

interface MonthlyPause {
  month: string;
  noofDaysinMonth: number;
  pauseEntries: PauseEntry[];
}

export const pauseResumePlanService = {
  async pausePlan(userId: string, planId: string, reason: string) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    const subPlan = await SubscriptionPlanModel.findOne({ _id: planId });
    if (!subPlan) throw new Error("Subscription Plan not found");

    const maxPause = subPlan.maxNoOfPausePerMonth;

    const plan = await PurchasedPlanModel.findOne({ userId, planId });
    if (!plan) throw new Error("Plan not found");

    if (plan.isPaused) throw new Error("You have already paused");

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const currentMonth = tomorrow.toISOString().slice(0, 7);

    let monthlyPause = plan.monthlyPausedDays.find(mp => mp.month === currentMonth) as MonthlyPause | undefined;

    if (!monthlyPause) {
      monthlyPause = {
        month: currentMonth,
        noofDaysinMonth: 0,
        pauseEntries: [
            {
                startDate: tomorrow,
                daysforthatPause: 0,
                reason: reason || "No reason provided",
            },
        ],
      };

      // Use `set` to trigger Mongoose change tracking
      plan.monthlyPausedDays.push(monthlyPause);
    }

    if (monthlyPause.noofDaysinMonth >= maxPause) {
      throw new Error("You have reached limit of pausing your plan for this month");
    }

    // Add new pause entry
    monthlyPause.pauseEntries.push({
      startDate: tomorrow,
      daysforthatPause: 0,
      reason,
    });

    plan.isPaused = true;
    await plan.save();

    return { message: "Plan paused successfully" };
  },

  async resumePlan(userId: string, planId: string) {
    const plan = await PurchasedPlanModel.findOne({ userId, planId });
    if (!plan) throw new Error("Plan not found");

    if (!plan.isPaused) throw new Error("You have not paused your plan");

    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const monthlyPause = plan.monthlyPausedDays.find(mp => mp.month === currentMonth) as MonthlyPause | undefined;

    if (!monthlyPause || monthlyPause.pauseEntries.length === 0) {
      throw new Error("No valid pause record found for this month");
    }

    const lastPauseEntry = monthlyPause.pauseEntries[monthlyPause.pauseEntries.length - 1];

    if (!lastPauseEntry) {
      throw new Error("No valid pause record found for this month");
    }

    const startDate = new Date(lastPauseEntry.startDate);
    const diffInMs = now.getTime() - startDate.getTime();
    let diffInDays = Math.max(1, Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
    if(startDate.getTime() > Date.now()) {
        diffInDays = 0;
    }
    lastPauseEntry.daysforthatPause = diffInDays;
    monthlyPause.noofDaysinMonth += diffInDays;
    plan.totalPaused += diffInDays;

    plan.isPaused = false;

    await plan.save();

    return {
      message: `Plan resumed successfully after ${diffInDays} day(s)`,
      pausedDaysAdded: diffInDays,
    };
  },
};
