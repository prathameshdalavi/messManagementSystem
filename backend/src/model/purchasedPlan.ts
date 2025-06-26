import mongoose, { Schema } from "mongoose";

const purchasedPlanSchema =new Schema({
    userId: { type:mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    purchaseDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
    messId: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true }
});
const PurchasedPlanModel = mongoose.model("PurchasedPlan", purchasedPlanSchema);
export { PurchasedPlanModel };