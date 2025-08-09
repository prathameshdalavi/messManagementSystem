import { AttendanceModel } from "../../model/attendance";
import { PurchasedPlanModel } from "../../model/purchasedPlan";
import { userModel } from "../../model/user";
import mongoose from "mongoose";

export const attendanceService = {
    async markAttendance(userId: string, scannedMessId: string, type: string) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        if (!scannedMessId) {
            throw new Error("Mess ID is required");
        }
        if (!type) {
            throw new Error("Attendance type is required");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Check if user has an active plan for the scanned mess
        const check = await PurchasedPlanModel.findOne({
            userId: userId,
            messId: scannedMessId,
            isActive: true
            // Removed isPaused: false condition to allow paused plans
        });
        if (!check) {
            throw new Error("User has no active plan for this mess. Cannot mark attendance.");
        }
        
        // If plan is paused, don't allow marking attendance
        if (check.isPaused) {
            throw new Error("Your plan is currently paused. Cannot mark attendance while plan is paused.");
        }

        const today = new Date();

        const existingAttendance = await AttendanceModel.findOne({
            user_id: userId,
            mess_id: scannedMessId,
            type: type,
            date: today
        });
        if (existingAttendance) {
            throw new Error("Attendance for today already exists");
        }

        const attendanceRecord = await AttendanceModel.create({
            user_id: userId,
            mess_id: scannedMessId,
            type: type,
            date: today,
        });

        return attendanceRecord;
    },

    async getRecords(userId: string, messId: string) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        if (!messId) {
            throw new Error("Mess ID is required");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Check if messId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(messId)) {
            throw new Error("Invalid messId format");
        }

        const plan = await PurchasedPlanModel.findOne({
            userId: userId,
            messId: messId,
            isActive: true
            // Removed isPaused: false condition to allow paused plans
        });
        
        if (!plan) {
            throw new Error("No active plan found for this user and mess");
        }

        const startDate = plan.purchaseDate;
        if (!startDate) {
            throw new Error("Plan purchase date not found.");
        }

        const records = await AttendanceModel.find({
            user_id: userId,
            mess_id: messId,
            date: { $gte: startDate }
        });
        
        const todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((todaysDate.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Calculate paused days from the plan
        let totalPausedDays = 0;
        if (plan.monthlyPausedDays && plan.monthlyPausedDays.length > 0) {
            plan.monthlyPausedDays.forEach(monthData => {
                if (monthData.pauseEntries && monthData.pauseEntries.length > 0) {
                    monthData.pauseEntries.forEach(pauseEntry => {
                        totalPausedDays += pauseEntry.daysforthatPause || 0;
                    });
                }
            });
        }
        
        // Also add the totalPaused field if it exists
        if (plan.totalPaused) {
            totalPausedDays += plan.totalPaused;
        }

        let totalDays = diffDays - totalPausedDays;
        if (totalDays < 0) totalDays = 0; // Ensure totalDays is not negative

        const countByType = (type: string) =>
            records.filter((record) => record.type === type).length;

        const getLunchAttendanceCount = countByType("lunch");
        const getBreakfastAttendanceCount = countByType("breakfast");
        const getDinnerAttendanceCount = countByType("dinner");

        const getLunchAbsentyCount = totalDays - getLunchAttendanceCount;
        const getBreakfastAbsentyCount = totalDays - getBreakfastAttendanceCount;
        const getDinnerAbsentyCount = totalDays - getDinnerAttendanceCount;

        const round = (val: number) => Math.round(val * 100) / 100;

        const lunchAttendancePercentage = round((getLunchAttendanceCount / totalDays) * 100);
        const breakfastAttendancePercentage = round((getBreakfastAttendanceCount / totalDays) * 100);
        const dinnerAttendancePercentage = round((getDinnerAttendanceCount / totalDays) * 100);

        const result = {
            totalDays,
            getLunchAttendanceCount,
            getBreakfastAttendanceCount,
            getDinnerAttendanceCount,
            getLunchAbsentyCount,
            getBreakfastAbsentyCount,
            getDinnerAbsentyCount,
            lunchAttendancePercentage,
            breakfastAttendancePercentage,
            dinnerAttendancePercentage,
            isPlanPaused: plan.isPaused,
            totalPausedDays
        };
        
        return result;
    }
};
