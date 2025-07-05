import mongoose, { Schema } from "mongoose";
const noticeSchema = new Schema({
    mess_id: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },   
})
const NoticeModel = mongoose.model("Notice", noticeSchema);
export { NoticeModel };