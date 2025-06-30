import mongoose, { Schema } from "mongoose";
const menuSchema = new Schema({
    mess_id: { type: mongoose.Schema.Types.ObjectId, required: true },
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
    ]
})
const menuModel = mongoose.model("Menu", menuSchema);
export {menuModel};
