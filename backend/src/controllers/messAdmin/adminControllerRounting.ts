import { Router } from "express";
import authRouter from "./authController";
import menuRouter from "./menuController";

const messAdminRouter = Router();

messAdminRouter.use("/auth", authRouter);
messAdminRouter.use("/menu", menuRouter)
export default messAdminRouter;