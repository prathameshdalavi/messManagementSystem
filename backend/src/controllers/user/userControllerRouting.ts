import { Router } from "express";
import authRouter from "./authController";
import messRouter from "./messController";
import menuRouter from "./menuController";
import planRouter from "./planController";
import buyPlanRouter from "./buyPlanController";
import attendanceRouter from "./attendanceController";
import myPlanRouter from "./myPlansController";
const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.use("/messes", messRouter);
userRouter.use("/menu", menuRouter); 
userRouter.use("/plan",planRouter); 
userRouter.use("/plans",myPlanRouter);
userRouter.use("/buyPlan", buyPlanRouter);
userRouter.use("/attendance",attendanceRouter);
export default userRouter;