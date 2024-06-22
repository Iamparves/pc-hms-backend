const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const config = require("../../config/index.js");
const APIFeaturesQuery = require("../../utils/apiFeaturesQuery.js");
const AppError = require("../../utils/appError.js");
const catchAsync = require("../../utils/catchAsync.js");
const filterObj = require("../../utils/filterObj.js");
const Notice = require("../models/notice.model.js");
const User = require("../models/user.model.js");

exports.createNewNotice = catchAsync(async (req, res, next) => {
  const noticeData = filterObj(
    req.body,
    "title",
    "content",
    "startDate",
    "endDate",
    "status",
    "audience"
  );
  noticeData.author = req.user._id;

  const notice = await Notice.create(noticeData);

  res.status(201).json({
    status: "success",
    message: "Notice created successfully",
    data: {
      notice,
    },
  });
});

exports.getAllNotices = catchAsync(async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  let userRole = "anonymous";

  if (token) {
    const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    userRole = currentUser.role;
  }

  if (userRole !== "admin") {
    req.query.startDate = new Date().setHours(24, 0, 0, 0);
    req.query.audience = { $in: ["all", userRole] };
  }

  req.query.sort = req.query.sort || "-createdAt";

  const features = new APIFeaturesQuery(Notice.find(), req.query)
    .filter()
    .startDateFilter()
    .sort()
    .limitFields()
    .paginate();

  const notices = await features.query;

  res.status(200).json({
    status: "success",
    results: notices.length,
    message: "All notices fetched successfully",
    data: {
      notices,
    },
  });
});

exports.getNotice = catchAsync(async (req, res, next) => {
  const notice = await Notice.findById(req.params.noticeId).populate({
    path: "author",
    select: "name email",
  });

  if (!notice) {
    return next(new AppError("Notice not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Notice fetched successfully",
    data: {
      notice,
    },
  });
});

exports.updateNotice = catchAsync(async (req, res, next) => {
  const noticeData = filterObj(
    req.body,
    "title",
    "content",
    "startDate",
    "endDate",
    "status",
    "audience"
  );

  const notice = await Notice.findByIdAndUpdate(
    req.params.noticeId,
    noticeData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!notice) {
    return next(new AppError("Notice not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Notice updated successfully",
    data: {
      notice,
    },
  });
});

exports.deleteNotice = catchAsync(async (req, res, next) => {
  const notice = await Notice.findByIdAndDelete(req.params.noticeId);

  if (!notice) {
    return next(new AppError("Notice not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Notice deleted successfully",
    data: null,
  });
});
