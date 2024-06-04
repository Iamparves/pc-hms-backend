import express from "express";
import {
  login,
  logout,
  protect,
  restrictTo,
  signup,
  updatePassword,
  verifyOTP,
} from "../controllers/auth.controller.js";
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
  getMe,
  updateMe,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", protect, getMe);

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter
  .route("/admin", protect, restrictTo("admin"))
  .get(getAdmins)
  .post(createAdmin);

userRouter.delete("/admin/:adminId", protect, restrictTo("admin"), deleteAdmin);

userRouter.patch("/verify-otp", verifyOTP);
userRouter.patch("/update-me", protect, restrictTo("patient"), updateMe);
userRouter.patch("/update-password", protect, updatePassword);

export default userRouter;
