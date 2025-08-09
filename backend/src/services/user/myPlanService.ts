import { PurchasedPlanModel } from "../../model/purchasedPlan";

export const myPlansService = {
    async getMyPlans(userId: string) {
        try {
            const myPlans = await PurchasedPlanModel.find({ userId: userId }).populate('planId').populate('messId');
            return myPlans;
        } catch (error) {
            throw new Error("Error fetching plans: " + error);
        }
    }
}