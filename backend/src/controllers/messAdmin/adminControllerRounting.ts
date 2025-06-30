import { Router } from "express";
import authRouter from "./authController";
import menuRouter from "./menuController";
import planRouter from "./PlanController";
const messAdminRouter = Router();

messAdminRouter.use("/auth", authRouter);
messAdminRouter.use("/menu", menuRouter)
messAdminRouter.use("/plan", planRouter);
export default messAdminRouter;