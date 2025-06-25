import mongoose, { Schema } from "mongoose";
const attendanceSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mess_id: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    type:{enum:["breakfast","lunch","dinner"],type:String,required:true},
    date: { type: Date, default: Date.now },
})
const AttendanceModel = mongoose.model("Attendance", attendanceSchema);
export { AttendanceModel };