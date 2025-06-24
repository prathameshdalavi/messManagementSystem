import { messAdminModel } from "../../model/messAdmin";
import { userModel } from "../../model/user";

export const nearbyMessService = {
  async getNearbyMesses(lat: number, lng: number, maxDistance = 5000) {
    return await messAdminModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistance,
        },
      },
    });
  },
};

export const assignMessService = {
  async assignMessToUser(userId: string, messId: string) {
    return await userModel.findByIdAndUpdate(
      userId,
      { mess_id: messId },
      { new: true }
    );
  },
};

