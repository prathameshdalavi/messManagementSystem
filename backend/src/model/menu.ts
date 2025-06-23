import mongoose, { Schema } from "mongoose";
const menuSchema = new Schema({
    mess_id: { type: String, required: true },
    menu: [
        {
            day: String,
            meals: {
                breakfast: [String],
                lunch: [String],
                dinner: [String],
                snacks: [String],
            }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
})
const menuModel = mongoose.model("Menu", menuSchema);
export {menuModel};