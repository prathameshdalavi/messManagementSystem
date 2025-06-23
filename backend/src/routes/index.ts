import { Router } from "express";
import userRouter from "../controllers/user";

const mainRouter = Router();

mainRouter.use("/user", userRouter);     // Access via /api/v1/user/

export default mainRouter;