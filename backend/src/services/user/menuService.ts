import { menuModel } from "../../model/menu";
import { userModel } from "../../model/user";


export const menuService = {
    async getMenu(messId: string) {
        if (!messId) {
            throw new Error("mess not found");
        }
        const menu = await menuModel.findOne({ mess_id: messId });
        if (!menu) {
            throw new Error("No menu found for this user");
        }
        return menu;
    }
};