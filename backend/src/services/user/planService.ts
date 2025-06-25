import { SubscriptionPlanModel } from "../../model/subcriptionPlan";
import { userModel } from "../../model/user";

export const planService = {
    async getPlans(userId: string) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.mess_id) {
            throw new Error("User is not assigned to any mess");
        }
        const mess_id = user.mess_id;

        const plans = await SubscriptionPlanModel.find({ mess_id: mess_id });
        if (!plans || plans.length === 0 ) {
            throw new Error("No plans found for this mess");
        }
        return plans;
    },
};