import jwt from "jsonwebtoken";
import config from "../../config/index.js";
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

  if (newUser.role === "admin") {
    return res.status(201).json({
      status: "success",
      message: "Admin created successfully!",
    });
  }

  await sendVerificationOTP(newUser, req, res, next);
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { mobileNo, otp } = req.body;

  const user = await User.findOne({ mobileNo });

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  if (user.isVerified) {
    return next(new AppError("User already verified!", 400));
  }

  if (user.verificationOTPExpires < Date.now()) {
    return next(new AppError("OTP expired! Please request a new OTP.", 400));
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

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  });
};
