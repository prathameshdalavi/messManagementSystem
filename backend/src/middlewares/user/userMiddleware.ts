import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
function userMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token;
    if (typeof token === "string") {
        const decodedToken = Jwt.verify(token, JWT_SECRET);
        console.log(decodedToken);
        if (decodedToken) {
            // @ts-ignore
            req.body.UserId = decodedToken.UserId;
            console.log(req.body.UserId);
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
export{userMiddleware};