import { Request, Response, Router } from "express";
import { ApiResponse } from "../../utils/apiResponce";
import { nearbyMessService ,assignMessService} from "../../services/user/messService";


const router = Router();

router.get("/nearby", async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (!lat || !lng) {
    new ApiResponse(res).error("Latitude and Longitude are required");
    return;
  }
  try {
    const messes = await nearbyMessService.getNearbyMesses(lat, lng);
    new ApiResponse(res).success(messes, "Nearby messes fetched", 200);
    return;
  } catch (error) {
    new ApiResponse(res).error(error);
    return;
  }
});


router.post("/select-mess", async (req: Request, res: Response) => {
  const { userId, messId } = req.body;

  if (!userId || !messId) {
    new ApiResponse(res).error("User ID and Mess ID required");
    return;
  }

  try {
    const updatedUser = await assignMessService.assignMessToUser(userId, messId);
    new ApiResponse(res).success(updatedUser, "Mess assigned to user", 200);
    return;
  } catch (error) {
    new ApiResponse(res).error(error);
    return;
  }
});



export default router;
