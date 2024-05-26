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
