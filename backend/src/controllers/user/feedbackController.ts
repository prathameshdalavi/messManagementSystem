import { Router, Request, Response } from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { feedbackService } from "../../services/user/feedbackService";

const router= Router();
router.post("/feedback",userMiddleware,async (req: Request, res: Response)=> {
    try {
        const user_id = req.user?.id;
        const messId=req.body.messId;
        if (!messId) {
            new ApiResponse(res).error("Mess ID is required");
            return;
        }
        if (!user_id) {
            new ApiResponse(res).error("User ID not found");
            return;
        }
        const feedback = req.body.feedback;
        if (!feedback) {
            new ApiResponse(res).error("Feedback is required");
            return;
        }
        const result = await feedbackService.addFeedback(user_id,messId, feedback);
        new ApiResponse(res).success(result, "Feedback added successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return;
    }
}) 
export default router;