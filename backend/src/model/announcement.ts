import mongoose, { Schema } from "mongoose";
const announcementSchema = new Schema({
    mess_id: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },   
})
const AnnouncementModel = mongoose.model("Announcement", announcementSchema);
export { AnnouncementModel };