import { menuModel } from "../../model/menu";
import { validateMenu } from "../../utils/validators/messAdminValidators/menuValidators";


export const menuService = {
    async addMenu(body: any, mess_id: any) {
        const validatedMenu = validateMenu(body);
        const existingMenu = await menuModel.findOne({mess_id});
        if (existingMenu) {
            throw new Error("Menu already exists for this mess");
        }
        const newMenu = await menuModel.create({
            mess_id,
            menu: validatedMenu.menu});
        return newMenu;
    },
    async updateMenu(body: any, mess_id: any) {
        const validatedMenu = validateMenu(body);
        const existingMenu = await menuModel.findOne({ mess_id });
        if (!existingMenu) {
            throw new Error("No menu found");
        }
        const updatedMenu = await menuModel.findOneAndUpdate(
            { mess_id },
            { menu: validatedMenu.menu, updatedAt: Date.now() },
            { new: true }
        );
        return updatedMenu;
    },
    async getMenu(mess_id: any) {
        const menu = await menuModel.findOne({ mess_id })
        if (!menu) {
            throw new Error("No menu found");
        }
        return menu;
    },
    async deleteMess(mess_id: any) {
        const menu = await menuModel.findOneAndDelete({ mess_id });
        if (!menu) {
            throw new Error("No menu found");
        }
        return menu;
    },

}