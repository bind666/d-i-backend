import express from "express";
import { registerUser, loginUser, logoutUser } from "../controller/userController";
import { auth } from "../middleware/auth";
import { validateLoginUser, validateRegisterUser } from "../validator/validator";
import ApiResponse from "../utils/ApiResponse";
import { AuthenticatedRequest } from "../types";

const userRouter = express.Router();

userRouter.post("/register", validateRegisterUser, registerUser);
userRouter.post("/login", validateLoginUser, loginUser);
userRouter.delete("/logout", auth, logoutUser);

userRouter.get("/profile", auth, (req: AuthenticatedRequest, res) => {
    res.status(200).json(new ApiResponse(req.user, "User profile fetched"));
});

export { userRouter };
