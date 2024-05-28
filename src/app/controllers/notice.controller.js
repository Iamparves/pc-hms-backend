import APIFeaturesQuery from "../../utils/apiFeaturesQuery.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import Notice from "../models/notice.model.js";

export const createNewNotice = catchAsync(async (req, res, next) => {
  const noticeData = filterObj(
    req.body,
    "title",
    "content",
    "startDate",
    "endDate",
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

export const getAllNotices = catchAsync(async (req, res, next) => {
  const features = new APIFeaturesQuery(Notice.find(), req.query)
    .filter()
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

export const getNotice = catchAsync(async (req, res, next) => {
  const notice = await Notice.findById(req.params.id).populate({
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

export const updateNotice = catchAsync(async (req, res, next) => {
  const noticeData = filterObj(
    req.body,
    "title",
    "content",
    "startDate",
    "endDate",
    "audience"
  );

  const notice = await Notice.findByIdAndUpdate(req.params.id, noticeData, {
    new: true,
    runValidators: true,
  });

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

export const deleteNotice = catchAsync(async (req, res, next) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);

  if (!notice) {
    return next(new AppError("Notice not found", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Notice deleted successfully",
    data: null,
  });
});
