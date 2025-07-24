import mongoose, { Schema } from "mongoose";
const pauseEntrySchema=new Schema({
    startDate:{type:Date,required:true},
    daysforthatPause:{type:Number,required:true},
    reason:{type:String}
})
const pausedDaySchema = new Schema({
    month: String,
    noofDaysinMonth: Number,
    pauseEntries: { type: [pauseEntrySchema], default: []}
}, { _id: false }); 
const purchasedPlanSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    purchaseDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
    messId: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true },
    monthlyPausedDays: { type: [pausedDaySchema], default: [] },
    isPaused: { type: Boolean, default: false },
    totalPaused: { type: Number, default: 0 },
});
const PurchasedPlanModel = mongoose.model("PurchasedPlan", purchasedPlanSchema);
export { PurchasedPlanModel }; 