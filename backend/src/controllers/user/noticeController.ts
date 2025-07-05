import { Router, Request, Response } from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { noticeService } from "../../services/user/noticeService";

const router=Router();
router.get("/getNotices",async function (req:Request,res:Response) {
    try{
        const userId = req.query.userId as string;
        const notices = await noticeService.getNotices(userId);
        new ApiResponse(res).success(notices, "Notices fetched successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return;
    }
})
export default router