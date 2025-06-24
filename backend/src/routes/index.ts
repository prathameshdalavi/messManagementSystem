import { Router } from "express";
import userRouter from "../controllers/user/userControllerRouting";
import messAdminRouter from "../controllers/messAdmin/adminControllerRounting";

const mainRouter = Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/messAdmin", messAdminRouter);

export default mainRouter;