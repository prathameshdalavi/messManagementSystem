import { Router, Request, Response } from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { menuService } from "../../services/user/menuService";

const router= Router();
router.get("/seeMenu",userMiddleware,async function (req:Request,res:Response) {
    try{
        const user_Id=req.body.UserId;
        const messMenu=await menuService.getMenu(user_Id);
        new ApiResponse(res).success(messMenu,"Menu Fetched Successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return
    }
})
export default router;