import { PurchasedPlanModel } from "../../model/purchasedPlan";
import { SubscriptionPlanModel } from "../../model/subcriptionPlan";
import { userModel } from "../../model/user";



export const buyPlanService = {
    async buyPlan(userId: string, planId: string) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        
        const plan=await SubscriptionPlanModel.findById(planId);
        if (!plan) {
            throw new Error("Plan not found");
        }
        const messId=plan.mess_id;
        if(!messId){
            throw new Error("Plan not found");
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
            messId: messId,
            monthlyPausedDays: [],
            isPaused: false,
            totalPaused: 0,
        });
        return purchasedPlan;
    }
};