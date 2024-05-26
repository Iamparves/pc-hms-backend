import express from "express";
import {
  login,
  logout,
  protect,
  signup,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { getMe } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", protect, getMe);

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.patch("/verify-otp", verifyOTP);

export default userRouter;
