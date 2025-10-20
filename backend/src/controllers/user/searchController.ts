import { Request, Response } from "express";
import { searchService } from "../../services/user/searchService";

export const searchMessesHandler = async (req: Request, res: Response) => {
    try {
        const q = (req.query.q as string) || "";
        if (!q.trim()) {
            return res.status(400).json({ success: false, message: "Query (q) is required" });
        }

        const data = await searchService.searchMesses(q);
        return res.status(200).json({ success: true, data, message: "Search results" });
    } catch (error: any) {
        console.error("Search error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};