import { Router , Request, Response} from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { attendanceService } from "../../services/user/attendanceService";

const router=Router()
router.post("/markattendance",userMiddleware,async function (req:Request,res:Response) {
    try{
        const userId = req.user?.id;
        if (!userId) {
            new ApiResponse(res).error("User ID not found");
            return;
        }
        const scannedMessId= req.body.messId; 
        const type = req.body.type;
        const attendance = await attendanceService.markAttendance(userId, scannedMessId, type);
        new ApiResponse(res).success(attendance, "Attendance marked successfully");
    }catch(error){
        new ApiResponse(res).error(error);
    }
})
router.post("/getRecords",userMiddleware,async function (req:Request,res:Response) {
    try{
        const userId = req.user?.id;
        if (!userId) {
            new ApiResponse(res).error("User ID not found");
            return;
        }
        const messId = req.body.messId;
        if (!messId) {
            new ApiResponse(res).error("Mess ID is required");
            return;
        }
        
        const records = await attendanceService.getRecords(userId, messId);
        new ApiResponse(res).success(records, "Attendance records fetched successfully");
    }catch(error){
        new ApiResponse(res).error(error);
    }
})

export default router