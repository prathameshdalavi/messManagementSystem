import { Router , Request, Response} from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { pauseResumePlanService } from "../../services/user/pausePlanService";


const router=Router()
router.post("/pausePlan",userMiddleware,async function (req:Request,res:Response) {
    try{
        const userId = req.user?.id;
        if (!userId) {
            new ApiResponse(res).error("User ID not found");
            return;
        }
        const planId = req.body.planId;
        const reason=req.body.reason;
        if (!planId) {
            new ApiResponse(res).error("Plan ID is required");
            return;
        }
        const pausePlan = await pauseResumePlanService.pausePlan(userId, planId,reason);
        new ApiResponse(res).success(pausePlan, "Plan paused successfully");
        return;
    }
    catch(error){
        new ApiResponse(res).error(error);
        return;
    }
})
router.post("/resumePlan",userMiddleware,async function (req:Request,res:Response) {
    try{
        const userId = req.user?.id;
        if (!userId) {
            new ApiResponse(res).error("User ID not found");
            return;
        }
        const planId = req.body.planId;
        if (!planId) {
            new ApiResponse(res).error("Plan ID is required");
            return;
        }
        const resumePlan = await pauseResumePlanService.resumePlan(userId, planId);
        new ApiResponse(res).success(resumePlan, "Plan resumed successfully");
        return;
    }
    catch(error){
        new ApiResponse(res).error(error);
        return;
    }
})

export default router;
