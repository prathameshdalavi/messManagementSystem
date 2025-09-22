import { messAdminModel } from "../../model/messAdmin";
import bcrypt from "bcrypt";

export const settingService = {
    async updateAdminSettings(adminId: string, updates: any) {
        const admin = await messAdminModel.findById(adminId);
        if (!admin) throw new Error("Admin not found");

        // Define allowed fields for update
        const allowedFields = ["messName", "email", "password", "phone", "messLocation", "capacity"];

        // Filter only allowed updates
        const filteredUpdates: any = {};
        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }

        // If password is being updated, hash it before storing
        if (filteredUpdates.password) {
            const saltRounds = 10; // secure default
            filteredUpdates.password = await bcrypt.hash(filteredUpdates.password, saltRounds);
        }

        // Update admin
        Object.assign(admin, filteredUpdates);
        await admin.save();

        return admin;
    }
};
