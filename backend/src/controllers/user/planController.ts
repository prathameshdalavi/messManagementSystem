import { Router, Request, Response } from "express";

import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { planService } from "../../services/user/planService";


const router =Router();
router.get("/getPlans",async function (req: Request, res: Response) {
    try {
        
        const messId = req.body.messId;
        const plan = await planService.getPlans( messId);
        new ApiResponse(res).success(plan, "Subscription plan fetched successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return;
    }
});

export default router;
