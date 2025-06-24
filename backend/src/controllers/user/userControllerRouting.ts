import { Router } from "express";
import authRouter from "./authController";
import messRouter from "./messController";
import menuRouter from "./menuController";
const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.use("/messes", messRouter);
userRouter.use("/menu", menuRouter); 
export default userRouter;