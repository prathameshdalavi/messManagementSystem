import { NoticeModel } from "../../model/notice";
import { SubscriptionPlanModel } from "../../model/subcriptionPlan";
import { userModel } from "../../model/user";

export const noticeService = {
    async getNotices(userId: string, mess_id: string) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        
        if (!mess_id) {
            throw new Error("User is not assigned to any mess");
        }
        const notices = await NoticeModel.find({ mess_id: mess_id }).sort({ createdAt: -1 });
        if (!notices || notices.length === 0) {
            throw new Error("No notices found for this user");
        }
        return notices;
    },
};