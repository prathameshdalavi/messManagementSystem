import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

function userMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token;
    if (typeof token === "string") {
        try {
            const decodedToken = Jwt.verify(token, JWT_SECRET) as any;
            req.user = { id: decodedToken.UserId };
            next();
        } catch (error) {
            res.status(401).json({
                message: "Invalid token",
                error: error
            });
        }
    } else {
        res.status(401).json({
            message: "Token not provided"
        });
    }
}

export { userMiddleware };