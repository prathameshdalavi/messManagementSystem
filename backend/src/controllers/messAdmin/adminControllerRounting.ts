import { Router } from "express";
import authRouter from "./authController";
import menuRouter from "./menuController";
import planRouter from "./PlanController";
import attendanceRouter from "./attendanceController";
import noticeRouter from "./noticeController";
const messAdminRouter = Router();

messAdminRouter.use("/auth", authRouter);
messAdminRouter.use("/menu", menuRouter)
messAdminRouter.use("/plan", planRouter);
messAdminRouter.use("/attendance",attendanceRouter);
messAdminRouter.use("/notice", noticeRouter);
export default messAdminRouter;