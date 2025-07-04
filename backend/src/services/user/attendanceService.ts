import { AttendanceModel } from "../../model/attendance";
import { PurchasedPlanModel } from "../../model/purchasedPlan";
import { userModel } from "../../model/user";

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
        if (!user.mess_id) {
            throw new Error("User is not assigned to any mess");
        }

        if (user.mess_id.toString() !== scannedMessId) {
            throw new Error("User is not authorized to mark attendance for this mess");
        }

        const check = await PurchasedPlanModel.findOne({
            userId: userId,
            messId: user.mess_id,
            isPaused: false,
            isActive: true,
        });
        if (!check) {
            throw new Error("User has no active plan. Cannot mark attendance.");
        }

        const today = new Date();

        const existingAttendance = await AttendanceModel.findOne({
            user_id: userId,
            mess_id: user.mess_id,
            type: type,
            date: today
        });
        if (existingAttendance) {
            throw new Error("Attendance for today already exists");
        }

        const attendanceRecord = await AttendanceModel.create({
            user_id: userId,
            mess_id: user.mess_id,
            type: type,
            date: today,
        });

        return attendanceRecord;
    },

    async getRecords(userId: string) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.mess_id) {
            throw new Error("User is not assigned to any mess");
        }

        

        const plan = await PurchasedPlanModel.findOne({
            userId: userId,
            messId: user.mess_id,
            isPaused: false,
            isActive: true
        });
        

        const startDate = plan?.purchaseDate;//change it by startDate of the mess plan after changing purchasedplan
        const records = await AttendanceModel.find({
            user_id: userId,
            mess_id: user.mess_id,
            date: { $gte: startDate }
        });
        const todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);

        if (!startDate) {
            throw new Error("Plan purchase date not found.");
        }

        const diffDays = Math.floor((todaysDate.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

        let totalDays = diffDays;
        const pausedDays = 0;
        totalDays = totalDays - pausedDays;

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

        return {
            totalDays,
            getLunchAttendanceCount,
            getBreakfastAttendanceCount,
            getDinnerAttendanceCount,
            getLunchAbsentyCount,
            getBreakfastAbsentyCount,
            getDinnerAbsentyCount,
            lunchAttendancePercentage,
            breakfastAttendancePercentage,
            dinnerAttendancePercentage
        };
    }
};
