import express from "express";
import { login, signup, verifyOTP } from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.patch("/verify-otp", verifyOTP);

export default userRouter;
