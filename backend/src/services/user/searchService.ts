import { messAdminModel } from "../../model/messAdmin";

export const searchService = {
    async searchMesses(q: string) {
        // escape user input for regex
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");

        const results = await messAdminModel
            .find({
                $or: [{ messName: { $regex: regex } }, { messLocation: { $regex: regex } }],
            })
            .select("messName messLocation phone capacity location") // return only required fields
            .limit(50)
            .lean();

        return results;
    },
};