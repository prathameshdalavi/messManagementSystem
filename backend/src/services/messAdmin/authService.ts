import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { messAdminModel } from "../../model/messAdmin";
import dotenv from "dotenv";
import { validateMessAdminSignup, validateMessAdminSignin } from "../../utils/validators/messAdminValidators/authValidators";
import mongoose from "mongoose";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
export const  authService = {
    async signup(data: any) {
        const validatedData = validateMessAdminSignup(data);
        const existingUser = await messAdminModel.findOne({ email: validatedData.email });
        if (existingUser) {
            throw new Error("User Already Exists");
        }
        const hashPassword = await bcrypt.hash(validatedData.password, 10);
        const { longitude, latitude } = validatedData.location;
        const messAdmin = await messAdminModel.create({
           
            messName: validatedData.messName,
            email: validatedData.email,
            password: hashPassword,
            phone: validatedData.phone,
            messLocation: validatedData.messLocation,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            capacity: validatedData.capacity,
        })
        const token = jwt.sign({ messAdminId: messAdmin._id }, JWT_SECRET, { expiresIn: "7d" });
        return { messAdmin, token }
    },
    async signin(data: any) {
        const validatedData = validateMessAdminSignin(data);
        const messAdmin = await messAdminModel.findOne({ email: validatedData.email });
        if (!messAdmin) {
            throw new Error("User does not exist");
        }
        if (!messAdmin.password) {
            throw new Error("Password not found");
        }
        const passwordMatch = await bcrypt.compare(validatedData.password, messAdmin.password);
        if (!passwordMatch) {
            throw new Error("Incorrect Password");
        }
        const token = jwt.sign({ messAdminId: messAdmin._id }, JWT_SECRET, { expiresIn: "7d" });
        return { messAdmin, token }
    }
}
