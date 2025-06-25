import { Router, Request, Response } from "express";

import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { planService } from "../../services/user/planService";


const router =Router();
router.get("/getPlans",userMiddleware,async function (req: Request, res: Response) {
    try {
        const user_Id = req.body.UserId;
        const plan = await planService.getPlans(user_Id);
        new ApiResponse(res).success(plan, "Subscription plan fetched successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return;
    }
});

export default router;
