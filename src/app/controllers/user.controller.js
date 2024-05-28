import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "profile",
    select: "-__v -createdAt -updatedAt",
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "name",
    "photo",
    "age",
    "gender",
    "bloodGroup",
    "address"
  );

  const filteredUser = filterObj(req.body, "name", "email");

  const user = await Patient.findByIdAndUpdate(req.user.profile, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (filteredUser.name || filteredUser.email) {
    await User.findByIdAndUpdate(req.user._id, filteredUser, {
      new: true,
      runValidators: true,
    });
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: {
      user,
    },
  });
});

export const createAdmin = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "name",
    "mobileNo",
    "password",
    "confirmPassword"
  );
  filteredBody.role = "admin";
  filteredBody.isVerified = true;

  const user = await User.create(filteredBody);

  return res.status(201).json({
    status: "success",
    message: "Admin created successfully",
    data: {
      user,
    },
  });
});
