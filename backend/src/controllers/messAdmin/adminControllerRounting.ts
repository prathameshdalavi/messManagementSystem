import { Router } from "express";
import authRouter from "./authController";

const messAdminRouter = Router();

messAdminRouter.use("/auth", authRouter);

export default messAdminRouter;