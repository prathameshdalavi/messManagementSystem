import { Request, Response, Router } from "express";
import { ApiResponse } from "../../utils/apiResponce";
import { authService } from "../../services/messAdmin/authService";
const router = Router();
router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { messAdmin, token } = await authService.signup(req.body);
        new ApiResponse(res).success({ messAdmin, token }, "messAdmin Created Successfully", 201);
        return;
    } catch (error) {
        new ApiResponse(res).error(error);
        return
    }
});
router.post("/signin", async (req: Request, res: Response) => {
    try {
        const { messAdmin, token } = await authService.signin(req.body);
        new ApiResponse(res).success({ messAdmin, token }, "messAdmin Signed In Successfully", 200);
        return
    } catch (error) {
        new ApiResponse(res).error(error);
        return
    }
});

export default router;
