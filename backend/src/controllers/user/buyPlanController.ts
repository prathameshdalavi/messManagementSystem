import { Router, Request, Response } from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { buyPlanService } from "../../services/user/buyPlanService";


const router = Router();
router.post("/buyPlan",userMiddleware, async function (req: Request, res: Response) {
    try {
        const userId = req.body.UserId;
        const planId = req.body.planId;
        const buyPlan = await buyPlanService.buyPlan(userId, planId);
        new ApiResponse(res).success(buyPlan, "Plan purchased successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return;
    }
})
export default router;  