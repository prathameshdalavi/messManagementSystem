import { Router } from "express";
import { settingService } from "../../services/messAdmin/settingService";
import { ApiResponse } from "../../utils/apiResponce";
import { adminMiddleware } from "../../middlewares/admin/adminMiddleware";

const router = Router();

router.post("/setting", adminMiddleware, async (req, res) => {
    try {
        const messAdminId = req.body.messAdminId;
        if (!messAdminId) {
            new ApiResponse(res).error("Admin ID not found", 400);
            return;
        }
        const updatedSettings = await settingService.updateAdminSettings(messAdminId, req.body);
        new ApiResponse(res).success(updatedSettings, "Admin settings updated successfully");
    } catch (error: any) {
        new ApiResponse(res).error(error.message || "Failed to update settings");
    }
});

export default router;
