import { menuModel } from "../../model/menu";
import { userModel } from "../../model/user";


export const menuService = {
    async getMenu(userId: string) {
        const user=await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.mess_id) {
            throw new Error("User is not assigned to any mess");
        }
        const messId = user.mess_id;
        const menu = await menuModel.findOne({ mess_id: messId });
        if (!menu) {
            throw new Error("No menu found for this user");
        }
        return menu;
    }
};