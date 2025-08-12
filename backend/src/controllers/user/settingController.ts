import { Request, Response, Router } from "express";
import { ApiResponse } from "../../utils/apiResponce";

import { settingService } from "../../services/user/settingService";
import { userMiddleware } from "../../middlewares/user/userMiddleware";
const router = Router();
router.put("/settings",userMiddleware, async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  console.log(userId); // from auth middleware
  if (!userId) {
    new ApiResponse(res).error("User ID not found", 400);
    return;
  }
  const updatedData = req.body;

  if (!updatedData || Object.keys(updatedData).length === 0) {
    new ApiResponse(res).error("No data provided for update", 400);
    return;
  }

  // Optional: check for password confirmation before updating
  if (updatedData.password && updatedData.confirmPassword) {
    if (updatedData.password !== updatedData.confirmPassword) {
      new ApiResponse(res).error("Passwords do not match", 400);
      return;
    }
    delete updatedData.confirmPassword; // remove before saving
  }

  const updatedUser = await settingService.updateUserSettings(userId, updatedData);

  new ApiResponse(res).success(updatedUser, "Settings updated successfully");
} catch (error: any) {
  new ApiResponse(res).error(error.message || "Failed to update settings");
}

});
router.get("/getuser", userMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      new ApiResponse(res).error("User ID not found", 400);
      return;
    }
    const user = await settingService.getUserSettings(userId);
    if (!user) {
      new ApiResponse(res).error("User not found", 404);
      return;
    }
    new ApiResponse(res).success(user, "User settings fetched successfully");
  } catch (error: any) {
    new ApiResponse(res).error(error.message || "Failed to fetch user settings");
  }
}); 
export default router;
