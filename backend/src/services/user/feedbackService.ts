import { FeedbackModel } from "../../model/feedback";
import { userModel } from "../../model/user";

export const feedbackService = {
    async addFeedback(userId: string,messId: string, feedback: string) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const feedbackRecord = {
            user_id: userId,
            mess_id: messId,
            feedback: feedback,
    }
        // Assuming you have a FeedbackModel to save feedback
        const result = await FeedbackModel.create(feedbackRecord);
        return result;
    }
}