import { NoticeModel } from "../../model/notice";
import { sendNoticeToAll } from "../../socket";

export const noticeService = {
    async sendNotice(message: string, title: string, mess_id: string) {
        if (!message || !title || !mess_id) {
            throw new Error("All fields are required");
        }
        const notice = await NoticeModel.create({ message, title, mess_id, createdAt: new Date() });
        const noticeToSend = {
            _id: notice._id.toString(),
            title: notice.title,
            message: notice.message,
            mess_id: notice.mess_id.toString(),
            createdAt: notice.createdAt instanceof Date ? notice.createdAt : new Date(notice.createdAt)
        };
        sendNoticeToAll(noticeToSend);
        return notice;

    },
    async getNotices(mess_id: string) {
        if (!mess_id) {
            throw new Error("mess_id is required");
        }
        const notices = await NoticeModel.find({ mess_id });
        if (!notices || notices.length === 0) {
            throw new Error("No notices found");
        }
        return notices;
    }
};