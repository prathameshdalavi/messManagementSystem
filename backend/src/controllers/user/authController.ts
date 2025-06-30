import { Request, Response, Router } from "express";
import { ApiResponse } from "../../utils/apiResponce";
import { authService } from "../../services/user/authService";
const router = Router();
router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { user, token } = await authService.signup(req.body);
        new ApiResponse(res).success({ user, token }, "User Created Successfully", 201);
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return
    }
});
router.post("/signin", async (req: Request, res: Response) => {
    try {
        const { user, token } = await authService.signin(req.body);
        new ApiResponse(res).success({ user, token }, "User Signed In Successfully", 200);
        return
    } catch (error) {
        new ApiResponse(res).error(error);
        return
    }
});

export default router;
