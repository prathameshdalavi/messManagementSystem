import mongoose, { Schema } from "mongoose";
const messAdminSchema=new Schema({
    messName: { type: String, required: true },
    mess_id: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    messLocation: { type: String, required: true },
    capacity: { type: Number, required: true },
})
const messAdminModel = mongoose.model("Admin", messAdminSchema);
export {messAdminModel};