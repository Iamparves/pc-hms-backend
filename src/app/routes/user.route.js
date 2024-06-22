const express = require("express");
const {
  forgotPassword,
  login,
  protect,
  resendVerificationOTP,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
  verifyOTP,
} = require("../controllers/auth.controller.js");

const {
  createAdmin,
  deleteAdmin,
  getAdmins,
  getMe,
  updateAdmin,
  updateMe,
} = require("../controllers/user.controller.js");
const checkFirstUser = require("../middlewares/checkFirstUser.js");

const userRouter = express.Router();

userRouter.get("/me", protect, getMe);

userRouter.post("/signup", checkFirstUser, signup);
userRouter.post("/login", login);

userRouter
  .route("/admin", protect, restrictTo("admin"))
  .get(getAdmins)
  .post(createAdmin);

userRouter
  .route("/admin/:adminId", protect, restrictTo("admin"))
  .patch(updateAdmin)
  .delete(deleteAdmin);

userRouter.patch("/verify-otp", verifyOTP);
userRouter.patch("/resend-otp", resendVerificationOTP);

userRouter.patch("/update-me", protect, restrictTo("patient"), updateMe);
userRouter.patch("/update-password", protect, updatePassword);

userRouter.post("/forgot-password", forgotPassword);
userRouter.patch("/reset-password", resetPassword);

module.exports = userRouter;
