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
        user.planId = plan._id;
        user.isSubActive= true;
        await user.save();
        return { message: "Plan purchased successfully", plan };
    }
};