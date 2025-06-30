import { Router , Request, Response} from "express";
import { adminMiddleware } from "../../middlewares/admin/adminMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { planService } from "../../services/messAdmin/planService";


const router= Router();
router.post("/createPlan",adminMiddleware,async function (req:Request,res:Response) {
    try{
        const mess_id = req.body.messAdminId;
        const plan=await planService.createPlan(req.body, mess_id);
        new ApiResponse(res).success(plan, "Subscription plan created successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return;
    }
});
router.get("/getPlans",adminMiddleware,async function (req:Request,res:Response) {
    try{
        const mess_id = req.body.messAdminId;
        const plan=await planService.getPlans(mess_id);
        new ApiResponse(res).success(plan, "Subscription plan fetched successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return;
    }
});
router.delete("/deletePlan", adminMiddleware, async function (req: Request, res: Response) {
  try {
    const mess_id = req.body.messAdminId;
    const planId = req.body.planId;
    const plan = await planService.deletePlan(planId, mess_id);
    new ApiResponse(res).success(plan, "Subscription plan deleted successfully");
  } catch (error) {
    new ApiResponse(res).error(error);
  }
});
router.post("/updatePlan",adminMiddleware,async function (req:Request,res:Response) {
    try {
        const mess_id = req.body.messAdminId;
        const plan = await planService.updatePlan(req.body.planId, req.body, mess_id);
        new ApiResponse(res).success(plan, "Subscription plan updated successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return;
    }
})
export default router;