import { PurchasedPlanModel } from "../../model/purchasedPlan";
import { userModel } from "../../model/user";

export const profileService = {
    async getUserProfile(userId: string) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        // Assuming UserModel is defined and imported
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;


    },
    async getUserMessHistory(userId: string) {
        if (!userId) throw new Error("User ID is required");

        const plans = await PurchasedPlanModel.find({ userId })
            .populate("messId") // populate mess details
            .populate("planId"); // populate subscription plan details

        if (!plans.length) {
            throw new Error("No plans found for this user");
        }

        return plans;
    }

}