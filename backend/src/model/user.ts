import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true },
    mess_id: { type: Schema.Types.ObjectId, ref: "messAdmin" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    hostelAddress: { type: String, required: true },
    isSubActive: { type: Boolean, default: true },
})
const userModel = mongoose.model("User", userSchema);
export { userModel };