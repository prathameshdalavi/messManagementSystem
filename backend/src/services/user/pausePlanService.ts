import { date } from "zod";
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

function getCurrentWindow(purchaseDate: Date, currentDate: Date): number {
  const diffInMs = currentDate.getTime() - purchaseDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffInDays / 30);
}

function getWindowStartDate(purchaseDate: Date, windowIndex: number): Date {
  const startDate = new Date(purchaseDate);
  startDate.setDate(purchaseDate.getDate() + (windowIndex * 30));
  return startDate;
}

function getWindowEndDate(purchaseDate: Date, windowIndex: number): Date {
  const endDate = new Date(purchaseDate);
  endDate.setDate(purchaseDate.getDate() + (windowIndex * 30) + 29);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
}

function getPausedDaysInWindow(plan: any, windowIndex: number, purchaseDate: Date): number {
  const windowStart = getWindowStartDate(purchaseDate, windowIndex);
  const windowEnd = getWindowEndDate(purchaseDate, windowIndex);
  
  let totalPausedDays = 0;

  for (const monthlyPause of plan.monthlyPausedDays) {
    for (const pauseEntry of monthlyPause.pauseEntries) {
      const pauseStart = new Date(pauseEntry.startDate);
      const pauseEnd = new Date(pauseStart);
      pauseEnd.setDate(pauseStart.getDate() + pauseEntry.daysforthatPause - 1);
      
      if (pauseStart <= windowEnd && pauseEnd >= windowStart) {
        const overlapStart = new Date(Math.max(pauseStart.getTime(), windowStart.getTime()));
        const overlapEnd = new Date(Math.min(pauseEnd.getTime(), windowEnd.getTime()));
        
        if (overlapStart <= overlapEnd) {
          const overlapDays = Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          totalPausedDays += overlapDays;
        }
      }
    }
  }

  return totalPausedDays;
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

    const purchaseDate = new Date(plan.purchaseDate);
    const currentWindow = getCurrentWindow(purchaseDate, tomorrow);
    const pausedDaysInCurrentWindow = getPausedDaysInWindow(plan, currentWindow, purchaseDate);

    if (pausedDaysInCurrentWindow >= maxPause) {
      throw new Error("You have reached limit of pausing your plan for this 30-day window");
    }

    const currentMonth = tomorrow.toISOString().slice(0, 7);
    let monthlyPause = plan.monthlyPausedDays.find(mp => mp.month === currentMonth) as MonthlyPause | undefined;

    if (!monthlyPause) {
      monthlyPause = {
        month: currentMonth,
        noofDaysinMonth: 0,
        pauseEntries: [],
      };
      plan.monthlyPausedDays.push(monthlyPause);
    }

    monthlyPause.pauseEntries.push({
      startDate: tomorrow,
      daysforthatPause: 0,
      reason: reason || "No reason provided",
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

    let lastPauseEntry: PauseEntry | null = null;
    let pauseMonthObj: MonthlyPause | undefined;

    for (let i = plan.monthlyPausedDays.length - 1; i >= 0; i--) {
      const monthObj = plan.monthlyPausedDays[i] as MonthlyPause;
      if (monthObj.pauseEntries.length > 0) {
        const latestEntry = monthObj.pauseEntries[monthObj.pauseEntries.length - 1];
        if (latestEntry.daysforthatPause === 0) {
          lastPauseEntry = latestEntry;
          pauseMonthObj = monthObj;
          break;
        }
      }
    }

    if (!lastPauseEntry || !pauseMonthObj) {
      throw new Error("No valid active pause record found");
    }

    const startDate = new Date(lastPauseEntry.startDate);
    const diffInMs = now.getTime() - startDate.getTime();
    let diffInDays = Math.max(1, Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
    if(startDate.getTime() > Date.now()) {
        diffInDays = 0;
    }
    
    lastPauseEntry.daysforthatPause = diffInDays;
    pauseMonthObj.noofDaysinMonth += diffInDays;
    plan.totalPaused += diffInDays;

    plan.isPaused = false;

    await plan.save();

    return {
      message: `Plan resumed successfully after ${diffInDays} day(s)`,
      pausedDaysAdded: diffInDays,
    };
  },
};
