import mongoose, { Schema } from "mongoose";
const feedbackSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mess_id: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    message: { type: String, required: true }
})
const FeedbackModel = mongoose.model("Feedback", feedbackSchema);
export { FeedbackModel };