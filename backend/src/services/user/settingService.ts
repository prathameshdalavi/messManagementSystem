import bcrypt from "bcrypt";
import { userModel } from "../../model/user";

export const settingService = {
    async updateUserSettings(userId: string, updates: any) {
        const user = await userModel.findById(userId);
        if (!user) throw new Error("User not found");

        // Fields allowed to update
        const allowedFields = ["name", "email", "password", "phone", "hostelAddress"];

        // Filter updates to only allowed fields
        const filteredUpdates: Record<string, any> = {};
        for (const key of allowedFields) {
            if (updates[key] !== undefined && updates[key] !== null) {
                filteredUpdates[key] = updates[key];
            }
        }

        // If password change requested, hash it
        if (filteredUpdates.password) {
            const salt = await bcrypt.genSalt(10);
            filteredUpdates.password = await bcrypt.hash(filteredUpdates.password, salt);
        }

        // Apply updates to user
        Object.assign(user, filteredUpdates);

        await user.save();
        return user;
    },
    async getUserSettings(userId: string) {
        const user = await userModel.findById(userId)
        if (!user) throw new Error("User not found");
        return user;
    }
};
