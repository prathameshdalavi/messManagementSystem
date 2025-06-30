import mongoose, { Schema } from "mongoose";
const messAdminSchema = new Schema({
    messName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    messLocation: { type: String, required: true },
    location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    capacity: { type: Number, required: true },
});

messAdminSchema.index({ location: "2dsphere" }); // for geospatial queries
const messAdminModel = mongoose.model("Admin", messAdminSchema);
export { messAdminModel };    