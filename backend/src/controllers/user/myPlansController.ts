import { Router, Request, Response } from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { myPlansService } from "../../services/user/myPlanService";

const router = Router();
router.get("/myPlans",userMiddleware, async function (req: Request, res: Response) {
    try{
        const user_Id = req.body.UserId;
        console.log("User ID from middleware:", user_Id);
        const myPlans=await myPlansService.getMyPlans(user_Id);
        new ApiResponse(res).success(myPlans, "My plans fetched successfully");
        return;
    }
    catch(error){
        new ApiResponse(res).error(error);
        return;
    }
})
export default router;