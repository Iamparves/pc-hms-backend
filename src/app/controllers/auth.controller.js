import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import User from "../models/user.model.js";

const sendVerificationOTP = async (user, req, res, next) => {
  const otp = await user.createVeificationOTP();

  // Send OTP to user's mobile number

  // Send response
  res.status(200).json({
    status: "success",
    message: `OTP sent to ${user.mobileNo}`,
    otp,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const userData = filterObj(
    req.body,
    "name",
    "mobileNo",
    "password",
    "confirmPassword",
    "role"
  );

  if (userData.role === "admin") {
    userData.isVerified = true;
    userData.profileModel = "Admin";
  }

  if (userData.role === "hospital") {
    userData.profileModel = "Hospital";
  }

  const newUser = await User.create(userData);

  await sendVerificationOTP(newUser, req, res, next);
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { mobileNo, otp } = req.body;

  const user = await User.findOne({ mobileNo });

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  if (user.verificationOTP !== otp) {
    return next(new AppError("Invalid OTP!", 400));
  }

  user.isVerified = true;
  user.verificationOTP = undefined;
  user.verificationOTPExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "User verified successfully!",
    isVerified: true,
  });
});
