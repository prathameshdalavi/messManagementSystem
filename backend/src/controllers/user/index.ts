import { Router } from "express";
import authRouter from "./authController";

const userRouter = Router();

userRouter.use("/auth", authRouter);

export default userRouter;