import { SubscriptionPlanModel } from "../../model/subcriptionPlan";
import { validatePlan } from "../../utils/validators/messAdminValidators/planValidators";

export const planService = {
  async createPlan(planData: any, messId: string) {
    const validatedPlan = validatePlan(planData);
    const existingPlan = await SubscriptionPlanModel.findOne({
      mess_id: messId,
      name: validatedPlan.name,
      isActive: true,
    });

    if (existingPlan) {
      throw new Error("Active plan with the same name already exists for this mess");
    }

    const newPlan = await SubscriptionPlanModel.create({
      mess_id: messId,
      name: validatedPlan.name,
      description: validatedPlan.description,
      amount: validatedPlan.amount,
      durationDays: validatedPlan.durationDays,
      features: validatedPlan.features,
    });

    return newPlan;
  },

  async getPlans(messId: string) {
    const plans = await SubscriptionPlanModel.find({ mess_id: messId });
    if (!plans || plans.length === 0) {
      throw new Error("No plans found for this mess");
    }
    return plans;
  },

  async deletePlan(planId: string, messId: string) {
    const plan = await SubscriptionPlanModel.findOneAndDelete({
      _id: planId,
      mess_id: messId,
    });

    if (!plan) {
      throw new Error("No plan found for the given ID and mess.");
    }

    return plan;
  },
    async updatePlan(planId: string, planData: any, messId: string) {
        const validatedPlan = validatePlan(planData);
        const existingPlan = await SubscriptionPlanModel.findOne({
        _id: planId,
        mess_id: messId,
        });
    
        if (!existingPlan) {
        throw new Error("No plan found for the given ID and mess.");
        }
    
        const updatedPlan = await SubscriptionPlanModel.findOneAndUpdate(
        { _id: planId, mess_id: messId },
        {
            name: validatedPlan.name,
            description: validatedPlan.description,
            amount: validatedPlan.amount,
            durationDays: validatedPlan.durationDays,
            features: validatedPlan.features,
            updatedAt: Date.now(),
        },
        { new: true }
        );
    
        return updatedPlan;
    }
};
