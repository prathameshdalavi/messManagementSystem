import { Router, Request, Response } from "express";
import { adminMiddleware } from "../../middlewares/admin/adminMiddleware";
import { attendanceService } from "../../services/messAdmin/attendanceService";
import { ApiResponse } from "../../utils/apiResponce";


const router = Router();
router.get("/todaysAttendance", adminMiddleware, async function (req: Request, res: Response) {
    try {
        const mess_id = req.body.messAdminId;
        const attendance = await attendanceService.getTodayAttendance(mess_id);
        new ApiResponse(res).success(attendance, "Attendance fetched successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return;
    }
})
router.get("/getRecords", adminMiddleware, async function (req: Request, res: Response) {
    try {
        const mess_id = req.body.messAdminId;
        const year = req.body.year;
        const month = req.body.month;
        if (!year || !month) {
            new ApiResponse(res).error("Year and month are required as query parameters");
            return;
        }
        const records = await attendanceService.getMonthlyAttendanceSummaryForAdmin(mess_id, year, month);
        new ApiResponse(res).success(records, "Attendance records fetched successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return;
    }
})
export default router;   