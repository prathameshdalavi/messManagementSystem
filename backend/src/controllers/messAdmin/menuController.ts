import { adminMiddleware } from "../../middlewares/admin/adminMiddleware";
import { menuService } from "../../services/messAdmin/menuService";

import { Request, Response, Router } from "express";
import { ApiResponse } from "../../utils/apiResponce";

const router = Router();

router.post("/addmenu",adminMiddleware, async function (req: Request, res: Response) {
    try {
        const  mess_id= req.body.messAdminId;
        const messMenu = await menuService.addMenu(req.body, mess_id);
        new ApiResponse(res).success(messMenu, "Mess menu added successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return;
    }
}),
    router.post("/updateMenu",adminMiddleware, async function (req: Request, res: Response) {
        try {
            const  mess_id= req.body.messAdminId;
            const menu = await menuService.updateMenu(req.body, mess_id);
            new ApiResponse(res).success(menu, "Menu updated successfully");
            return;
        } catch (error) {
            new ApiResponse(res).error(error);
            return;
        }
    }),
    router.get("/getMenu",adminMiddleware, async function (req: Request, res: Response) {
        try {
            const mess_id = req.body.messAdminId;
            const menu = await menuService.getMenu(mess_id);
            new ApiResponse(res).success(menu, "Menu fetched successfully");
            return;
        } catch (error) {
            new ApiResponse(res).error(error);
            return;
        }
    }),
    router.delete("/deleteMenu",adminMiddleware, async function (req: Request, res: Response) {
        try {
            const mess_id = req.body.messAdminId;
            const menu = await menuService.deleteMess(mess_id);
            new ApiResponse(res).success(menu, "Menu deleted successfully");
            return;
        } catch (error) {
            new ApiResponse(res).error(error);
            return;
        }
    })
export default router;