import { Response } from "express";
export class ApiResponse {
    constructor(public res: Response) { }
    success(data: any, message: string, statusCode: number = 200) {
        return this.res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    error(error: any, statusCode: number = 500) {
        console.error(error);
        return this.res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}
