import { get } from "mongoose";
import { AttendanceModel } from "../../model/attendance";


export const attendanceService = {
    async getTodayAttendance(mess_id: string) {
        if (!mess_id) {
            throw new Error("Mess ID is required");
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // 00:00:00

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); // 23:59:59

        const [breakfastRecords, lunchRecords, dinnerRecords] = await Promise.all([
            AttendanceModel.find({ mess_id, type: "breakfast", date: { $gte: todayStart, $lte: todayEnd } }),
            AttendanceModel.find({ mess_id, type: "lunch", date: { $gte: todayStart, $lte: todayEnd } }),
            AttendanceModel.find({ mess_id, type: "dinner", date: { $gte: todayStart, $lte: todayEnd } }),
        ]);

        return {
            breakfast: breakfastRecords.length,
            lunch: lunchRecords.length,
            dinner: dinnerRecords.length,
        };
    },

    async getMonthlyAttendanceSummaryForAdmin(messAdminId: string, year: number, month: number) {
        if (!messAdminId || !year || !month) {
            throw new Error("Mess Admin ID, year, and month are required");
        }

        // Create date range for the given month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        endDate.setHours(23, 59, 59, 999); // include entire last day

        // Fetch all attendance records for that mess in the date range
        const records = await AttendanceModel.find({
            mess_id: messAdminId,
            date: { $gte: startDate, $lte: endDate }
        });

        // Build a map: date => { breakfast: X, lunch: Y, dinner: Z }
        const dailySummaryMap = new Map<string, { breakfast: number, lunch: number, dinner: number }>();

        for (const record of records) {
            const dateStr = new Date(record.date).toISOString().split("T")[0]; // "YYYY-MM-DD"

            if (!dailySummaryMap.has(dateStr)) {
                dailySummaryMap.set(dateStr, { breakfast: 0, lunch: 0, dinner: 0 });
            }

            const summary = dailySummaryMap.get(dateStr)!;
            if (record.type === "breakfast") summary.breakfast += 1;
            if (record.type === "lunch") summary.lunch += 1;
            if (record.type === "dinner") summary.dinner += 1;
        }

        // Generate result for all days in month (even if no attendance)
        const result = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split("T")[0];
            const summary = dailySummaryMap.get(dateStr) || {
                breakfast: 0,
                lunch: 0,
                dinner: 0
            };
            result.push({
                date: dateStr,
                ...summary
            });
        }

        return result;
    }
}