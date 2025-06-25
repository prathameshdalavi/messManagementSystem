import { Router } from "express";
import authRouter from "./authController";
import messRouter from "./messController";
import menuRouter from "./menuController";
import planRouter from "./planController";
import buyPlanRouter from "./buyPlanController";
const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.use("/messes", messRouter);
userRouter.use("/menu", menuRouter); 
userRouter.use("/plan",planRouter); 
userRouter.use("/buyPlan", buyPlanRouter);
export default userRouter;