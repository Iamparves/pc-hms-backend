import express from "express";
import { signup, verifyOTP } from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.patch("/verify-otp", verifyOTP);

export default userRouter;
