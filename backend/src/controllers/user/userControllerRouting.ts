import { Router } from "express";
import authRouter from "./authController";
import messRouter from "./messController";
import menuRouter from "./menuController";
import planRouter from "./planController";
import buyPlanRouter from "./buyPlanController";
import attendanceRouter from "./attendanceController";
import myPlanRouter from "./myPlansController";
import pauseResumeRouter from "./PauseresumeController";
import feedbackRouter from "./feedbackController";
import noticeRouter from "./noticeController";
import profileRouter from "./profile";
import settingRouter from "./settingController"; // Importing settings controller
import { searchMessesHandler } from "./searchController";
const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.use("/messes", messRouter);
userRouter.use("/menu", menuRouter);
userRouter.use("/plan", planRouter);
userRouter.use("/plans", myPlanRouter);
userRouter.use("/feedback", feedbackRouter);
userRouter.use("/buyPlan", buyPlanRouter);
userRouter.use("/pauseResume", pauseResumeRouter);
userRouter.use("/attendance", attendanceRouter);
userRouter.use("/notice", noticeRouter);
userRouter.use("/profile", profileRouter);
userRouter.use("/settings", settingRouter); // Importing settings controller
userRouter.get("/mess/search", searchMessesHandler); // Add this route
export default userRouter;