import express from "express";
import {
  login,
  logout,
  signup,
  verifyOTP,
} from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.patch("/verify-otp", verifyOTP);

export default userRouter;
