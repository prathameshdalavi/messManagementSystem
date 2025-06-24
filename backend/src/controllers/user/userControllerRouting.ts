import { Router } from "express";
import authRouter from "./authController";
import messRouter from "./messController";

const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.use("/messes", messRouter);

export default userRouter;