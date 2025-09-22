import { Router } from "express";
import authRouter from "./authController";
import menuRouter from "./menuController";
import planRouter from "./PlanController";
import attendanceRouter from "./attendanceController";
import noticeRouter from "./noticeController";
import settingRouter from "./settingContorller"; // Importing settings controller
const messAdminRouter = Router();

messAdminRouter.use("/auth", authRouter);
messAdminRouter.use("/menu", menuRouter)
messAdminRouter.use("/plan", planRouter);
messAdminRouter.use("/attendance",attendanceRouter);
messAdminRouter.use("/notice", noticeRouter);
messAdminRouter.use("/updateSettings", settingRouter); // Importing settings controller
export default messAdminRouter;