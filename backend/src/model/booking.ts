import mongoose, { Schema } from "mongoose";
const bookingSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mess_id: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    NoOfguests: { type: Number, required: true },
    date: { type: Date, default: Date.now },
})
const BookingModel = mongoose.model("Booking", bookingSchema);
export { BookingModel };