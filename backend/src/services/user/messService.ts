import { messAdminModel } from "../../model/messAdmin";
import { userModel } from "../../model/user";

export const nearbyMessService = {
  async getNearbyMesses(lat: number, lng: number, maxDistance = 700000) {
    return await messAdminModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance", // distance in meters
          maxDistance: maxDistance,
          spherical: true,
        },
      },
      { $sort: { distance: 1 } } // just to be extra sure
    ]);
  },
};

// export const assignMessService = {
//   async assignMessToUser(userId: string, messId: string) {
//     return await userModel.findByIdAndUpdate(
//       userId,
//       { mess_id: messId },
//       { new: true }
//     );
//   },
// };

