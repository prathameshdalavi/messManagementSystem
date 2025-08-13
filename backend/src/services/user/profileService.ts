
import { PurchasedPlanModel } from "../../model/purchasedPlan";
import { userModel } from "../../model/user";

export const profileService = {
    async getUserProfile(userId: string) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    },

    async getUserMessHistory(userId: string) {
        if (!userId) throw new Error("User ID is required");

        try {
            const plans = await PurchasedPlanModel.find({ userId })
                .populate("messId") // populate mess details
                .populate("planId"); // populate subscription plan details

            // Return empty array instead of throwing error when no plans found
            return plans || [];
        } catch (error) {
            console.error("Error fetching user mess history:", error);
            // Return empty array on database errors too (optional - you might want to throw here)
            return [];
        }
    }
}