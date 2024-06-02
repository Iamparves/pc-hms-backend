import jwt from "jsonwebtoken";
import { promisify } from "util";
import config from "../../config/index.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import { sendSms } from "../../utils/sendSms.js";
import Hospital from "../models/hospital.model.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";

const signToken = (id) =>
  jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "None",
    maxAge: new Date(
      config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // 90 days
    ),
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};

const sendVerificationOTP = async (user, req, res, next) => {
  const otp = await user.createVeificationOTP();

  // Send OTP to user's mobile number
  const message = `Your Patientoo verification code is ${otp}. This code will expire in 10 minutes.`;

  try {
    const result = await sendSms(user.mobileNo, message);

    if (result.success_message) {
      return res.status(200).json({
        status: "success",
        mobileNo: user.mobileNo,
        message: `OTP sent to ${user.mobileNo}`,
      });
    } else {
      return next(
        new AppError(
          result.error_message || "There was an error sending the OTP.",
          500
        )
      );
    }
  } catch (error) {
    console.log(error);

    return next(
      new AppError(
        "There was an error sending the OTP. Please try again later!",
        500
      )
    );
  }
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

  if (userData.role === "hospital") {
    userData.profileModel = "Hospital";

    const newHospital = await Hospital.create({
      name: userData.name,
      contactNumber: userData.mobileNo,
    });

    userData.profile = newHospital._id;
  }

  if (userData.role === "patient") {
    userData.profileModel = "Patient";

    const newPatient = await Patient.create({
      name: userData.name,
      contactNumber: userData.mobileNo,
    });

    userData.profile = newPatient._id;
  }

  const newUser = await User.create(userData);

  await sendVerificationOTP(newUser, req, res, next);
});

export const login = catchAsync(async (req, res, next) => {
  const { mobileNo, password } = req.body;

  if (!mobileNo || !password) {
    return next(
      new AppError("Please provide mobile number and password!", 400)
    );
  }

  const user = await User.findOne({ mobileNo }).select("+password").populate({
    path: "profile",
    select: "-__v -createdAt -updatedAt",
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect mobile number or password!", 401));
  }

  if (!user.isVerified) {
    return next(new AppError("User not verified!", 401));
  }

  return sendTokenResponse(user, 200, res);
});

export const logout = catchAsync(async (req, res) => {
  res.clearCookie("jwt");

  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully!" });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { mobileNo, otp } = req.body;

  const user = await User.findOne({ mobileNo }).select(
    "+verificationOTP +verificationOTPExpires"
  );

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

  if (!currentUser.isVerified) {
    return next(new AppError("User not verified!", 401));
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

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(
      new AppError(
        "Please provide your current password and new password and confirm new password",
        400
      )
    );
  }

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your provided current password is wrong.", 401));
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  res.clearCookie("jwt");

  return res.status(200).json({
    status: "success",
    message: "Password changed successfully!",
  });
});
