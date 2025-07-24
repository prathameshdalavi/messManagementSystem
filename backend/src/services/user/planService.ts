import { SubscriptionPlanModel } from "../../model/subcriptionPlan";
export const planService = {
    async getPlans( messId: string) {
        const mess_id=messId;
        if (!mess_id) {
            throw new Error("mess_id is required");
        }
        const plans = await SubscriptionPlanModel.find({ mess_id: mess_id });
        if (!plans || plans.length === 0 ) {
            throw new Error("No plans found for this mess");
        }
        return plans; 
    },
};