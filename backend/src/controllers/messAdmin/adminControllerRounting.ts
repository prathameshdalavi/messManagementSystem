import { Router } from "express";
import authRouter from "./authController";
import menuRouter from "./menuController";
import planRouter from "./PlanController";
import attendanceRouter from "./attendanceController";
const messAdminRouter = Router();

messAdminRouter.use("/auth", authRouter);
messAdminRouter.use("/menu", menuRouter)
messAdminRouter.use("/plan", planRouter);
messAdminRouter.use("/attendance",attendanceRouter);
export default messAdminRouter;