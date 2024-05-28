import express from "express";
import {
  login,
  logout,
  protect,
  restrictTo,
  signup,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { getMe, updateMe } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", protect, getMe);

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.patch("/verify-otp", verifyOTP);

userRouter.patch("/update-me", protect, restrictTo("patient"), updateMe);

export default userRouter;
