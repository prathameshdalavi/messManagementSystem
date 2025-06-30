import mongoose, { Schema } from "mongoose";
import { number } from "zod";
const SubscriptionPlanSchema = new Schema({
    name: { type: String, required: true },
    mess_id: { type: mongoose.Schema.Types.ObjectId,required:true },
    description: { type: String },
    amount: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    features: [String], 
    isActive: { type: Boolean, default: true },
    maxNoOfPausePerMonth: { type: Number,required: true},
    createdAt: { type: Date, default: Date.now }
});
const SubscriptionPlanModel = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
export {SubscriptionPlanModel};