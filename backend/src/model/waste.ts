import mongoose, { Schema } from "mongoose";
const wasteSchema = new Schema({
    mess_id: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    date: { type: Date, default: Date.now },
    waste: { type: Number, required: true },
})
const WasteModel = mongoose.model("Waste", wasteSchema);
export { WasteModel };