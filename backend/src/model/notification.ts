import mongoose, { Schema } from "mongoose";
const NotificationSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    mess_id: { type: Schema.Types.ObjectId, ref: "User" },
    message: String,
    createdAt: { type: Date, default: Date.now }
})
const NotificationModel = mongoose.model("Notification", NotificationSchema);
export { NotificationModel };
