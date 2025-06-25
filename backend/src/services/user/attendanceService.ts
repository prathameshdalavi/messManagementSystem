import { AttendanceModel } from "../../model/attendance";
import { userModel } from "../../model/user";

export const attendanceService = {
    async markAttendance(userId: string,scannedMessId: string, type: string) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        if (!scannedMessId) {
            throw new Error(" Mess ID is required");
        }
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.mess_id) {
            throw new Error("User is not assigned to any mess");
        }
        if (user.isSubActive === false) {
            throw new Error("User's subscription is not active");
        }
        if (user.mess_id.toString() !== scannedMessId) {
            throw new Error("User is not authorized to mark attendance for this mess");
        }
        if(!type){
            throw new Error("Attendance type is required");
        }
        // Get today's date in YYYY-MM-DD format (UTC)
        const today = new Date().toISOString().split("T")[0];
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
    }

};