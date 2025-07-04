import { Router , Request, Response} from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { attendanceService } from "../../services/user/attendanceService";

const router=Router()
router.post("/markattendance",userMiddleware,async function (req:Request,res:Response) {
    try{
        const userId = req.body.UserId;
        const scannedMessId= req.body.messId; 
        const type = req.body.type;
        const attendance = await attendanceService.markAttendance(userId, scannedMessId, type);
        new ApiResponse(res).success(attendance, "Attendance marked successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return;
    }
})
router.get("/getRecords",userMiddleware,async function (req:Request,res:Response) {
    try{
        const userId = req.body.UserId;
        const records = await attendanceService.getRecords(userId);
        new ApiResponse(res).success(records, "Attendance records fetched successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return;
    }
})

export default router