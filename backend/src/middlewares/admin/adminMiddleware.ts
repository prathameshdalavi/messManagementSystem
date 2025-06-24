import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token;
    if (typeof token === "string") {
        const decodedToken = Jwt.verify(token, JWT_SECRET);
        console.log(decodedToken);
        if (decodedToken) {
            // @ts-ignore
            req.body.messAdminId = decodedToken.messAdminId;
            console.log(req.body.messAdminId);
            next();
        }
        else{
            res.status(401).json({
                message:"You are not Signed in",
                decodedToken
            })  
        }
    }
}
export{adminMiddleware};