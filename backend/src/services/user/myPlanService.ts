import { PurchasedPlanModel } from "../../model/purchasedPlan";


export const myPlansService={
    async getMyPlans(userId: string) {
        try {
            const myPlans = await PurchasedPlanModel.find({ userId: userId })
            if (!myPlans || myPlans.length === 0) {
                throw new Error("No plans found for this user");
            }
            return myPlans;
        } catch (error) {
            throw new Error("Error fetching plans: " + error);
        }
    }
}