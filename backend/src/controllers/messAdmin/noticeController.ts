import { Router, Request, Response } from "express";
import { adminMiddleware } from "../../middlewares/admin/adminMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { noticeService } from "../../services/messAdmin/noticeService";

const router=Router();
router.post("/send",adminMiddleware,async function (req:Request,res:Response) {
    try{
        const mess_id = req.body.messAdminId;
        const title=req.body.title;
        const message=req.body.message;
        const notice=await noticeService.sendNotice(message,title,mess_id);
        new ApiResponse(res).success(notice, "Notice sent successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return;
    }
})
router.get ("/getNotices",adminMiddleware,async function (req:Request,res:Response) {
    try{
        const mess_id = req.body.messAdminId;
        const notices = await noticeService.getNotices(mess_id);
        new ApiResponse(res).success(notices, "Notices fetched successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return;
    }
})
export default router