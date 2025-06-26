import { PurchasedPlanModel } from "../../model/purchasedPlan";
import { SubscriptionPlanModel } from "../../model/subcriptionPlan";
import { userModel } from "../../model/user";



export const buyPlanService = {
    async buyPlan(userId: string, planId: string) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.mess_id) {
            throw new Error("User is not assigned to any mess");
        }
        const messId = user.mess_id;
        const plan = await SubscriptionPlanModel.findOne({ _id: planId, mess_id: messId });
        if (!plan) {
            throw new Error("Plan not found for this mess");
        }
        const existingPlan = await PurchasedPlanModel.findOne({ userId: userId, planId: planId });
        if (existingPlan) {
            throw new Error("User already has this plan");
        }
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.durationDays);
        const purchasedPlan=await PurchasedPlanModel.create({
            userId: userId,
            planId: planId,
            purchaseDate: new Date(),
            isActive: true,
            expiryDate: expiryDate,
            messId: messId
        });
        return purchasedPlan;
    }
};