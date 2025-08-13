import { Router } from "express";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponce";
import { profileService } from "../../services/user/profileService";
import { userMiddleware } from "../../middlewares/user/userMiddleware";


const router = Router();
router.get("/profile", userMiddleware, async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            new ApiResponse(res).error("User ID not found");
            return;
        }

        const user = await profileService.getUserProfile(user_id);
        const messHistory = await profileService.getUserMessHistory(user_id);

        new ApiResponse(res).success({ user, messHistory }, "User profile fetched successfully");
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
    }
});

export default router;
