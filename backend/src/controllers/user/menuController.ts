import { Router, Request, Response } from "express";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
import { ApiResponse } from "../../utils/apiResponce";
import { menuService } from "../../services/user/menuService";

const router= Router();
router.get("/seeMenu",async function (req:Request,res:Response) {
    try{
        const mess_id = req.query.messId as string | undefined;
        if (!mess_id) {
            new ApiResponse(res).error("messId is required");
            return;
        }
        const messMenu = await menuService.getMenu(mess_id);
        new ApiResponse(res).success(messMenu, "Menu Fetched Successfully");
        return;
    }catch(error){
        new ApiResponse(res).error(error);
        return
    }
})
export default router;