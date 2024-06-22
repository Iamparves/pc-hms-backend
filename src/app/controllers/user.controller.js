const AppError = require("../../utils/appError.js");
const catchAsync = require("../../utils/catchAsync.js");
const filterObj = require("../../utils/filterObj.js");
const Patient = require("../models/patient.model.js");
const User = require("../models/user.model.js");

exports.getMe = catchAsync(async (req, res, next) => {
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

exports.updateMe = catchAsync(async (req, res, next) => {
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

  await Patient.findByIdAndUpdate(req.user.profile, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (filteredUser.name || filteredUser.email) {
    await User.findByIdAndUpdate(req.user._id, filteredUser, {
      new: true,
      runValidators: true,
    });
  }

  const user = await User.findById(req.user._id).populate({
    path: "profile",
    select: "-__v -createdAt -updatedAt",
  });

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: {
      user,
    },
  });
});

exports.createAdmin = catchAsync(async (req, res, next) => {
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

exports.updateAdmin = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "name", "email");

  const user = await User.findByIdAndUpdate(req.params.adminId, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("Admin not found", 404));
  }

  return res.status(200).json({
    status: "success",
    message: "Admin updated successfully",
    data: {
      user,
    },
  });
});

exports.getAdmins = catchAsync(async (req, res, next) => {
  const admins = await User.find({ role: "admin" });

  return res.status(200).json({
    status: "success",
    message: "Admins fetched successfully",
    data: {
      admins,
    },
  });
});

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  if (req.user._id === req.params.adminId) {
    return next(new AppError("You can't delete yourself", 400));
  }

  const user = await User.findByIdAndDelete(req.params.adminId);

  if (!user) {
    return next(new AppError("Admin not found", 404));
  }

  return res.status(200).json({
    status: "success",
    message: "Admin deleted successfully",
  });
});
