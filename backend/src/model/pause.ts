import { Schema } from "mongoose";

export const pauseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId,required: true },
    planId: { type: Schema.Types.ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true }
})
