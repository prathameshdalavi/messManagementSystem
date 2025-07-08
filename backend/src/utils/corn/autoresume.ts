import { PurchasedPlanModel } from "../../model/purchasedPlan";
import { SubscriptionPlanModel} from "../../model/subcriptionPlan";

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

export const autoResumePausedPlans = async (): Promise<{ message: string }> => {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);

  const pausedPlans = await PurchasedPlanModel.find({ isPaused: true });

  for (const plan of pausedPlans) {
    const subPlan = await SubscriptionPlanModel.findById(plan.planId);
    if (!subPlan) continue;

    const maxPause = subPlan.maxNoOfPausePerMonth;

    const allMonths = plan.monthlyPausedDays as MonthlyPause[];

    let lastPauseEntry: PauseEntry | null = null;
    let pauseMonthObj: MonthlyPause | undefined;

    for (let i = allMonths.length - 1; i >= 0; i--) {
      const monthObj = allMonths[i];
      if (monthObj.pauseEntries.length > 0) {
        lastPauseEntry = monthObj.pauseEntries[monthObj.pauseEntries.length - 1];
        pauseMonthObj = monthObj;
        break;
      }
    }

    if (!lastPauseEntry || !pauseMonthObj) continue;

    const startDate = new Date(lastPauseEntry.startDate);
    const diffInMs = now.getTime() - startDate.getTime();
    let diffInDays = Math.max(1, Math.floor(diffInMs / (1000 * 60 * 60 * 24)));

    const pauseMonth = startDate.toISOString().slice(0, 7);
    const isDifferentMonth = pauseMonth !== currentMonth;

    if (isDifferentMonth) {
      const endOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      const daysInOldMonth = Math.floor((endOfMonth.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      lastPauseEntry.daysforthatPause = daysInOldMonth;
      pauseMonthObj.noofDaysinMonth += daysInOldMonth;
      plan.totalPaused += daysInOldMonth;

      const nextMonthStart = new Date(endOfMonth);
      nextMonthStart.setDate(nextMonthStart.getDate() + 1);
      nextMonthStart.setHours(0, 0, 0, 0);

      const newMonth = nextMonthStart.toISOString().slice(0, 7);
      let newMonthlyPause = allMonths.find(mp => mp.month === newMonth);

      if (!newMonthlyPause) {
        newMonthlyPause = {
          month: newMonth,
          noofDaysinMonth: 0,
          pauseEntries: [],
        };
        allMonths.push(newMonthlyPause);
      }

      newMonthlyPause.pauseEntries.push({
        startDate: nextMonthStart,
        daysforthatPause: 0,
        reason: lastPauseEntry.reason || "Auto-continued from last month",
      });

      // isPaused remains true
    } else {
      if (diffInDays + pauseMonthObj.noofDaysinMonth >= maxPause) {
        lastPauseEntry.daysforthatPause = diffInDays;
        pauseMonthObj.noofDaysinMonth += diffInDays;
        plan.totalPaused += diffInDays;
        plan.isPaused = false;
      }
    }

    await plan.save();
  }

  return { message: "Auto resume check completed" };
};
