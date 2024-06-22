const APIFeaturesQuery = require("../../utils/apiFeaturesQuery");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Comment = require("../models/comment.model");

exports.createComment = catchAsync(async (req, res, next) => {
  const commentData = {
    content: req.body.content,
    blog: req.body.blog,
    user: req.user._id,
  };

  const newComment = await Comment.create(commentData);

  res.status(201).json({
    status: "success",
    message: "New comment created successfully",
    data: {
      comment: newComment,
    },
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  req.query.populate = "user:name";

  const features = new APIFeaturesQuery(Comment.find(), req.query)
    .filter()
    .populate()
    .sort()
    .limitFields()
    .paginate();

  const comments = await features.query;

  res.status(200).json({
    status: "success",
    message: "Comments retrieved successfully",
    data: {
      comments,
    },
  });
});

exports.getCommentsByBlog = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({
    blog: req.params.blogId,
  })
    .sort("-createdAt")
    .populate({
      path: "user",
      select: "name",
    });

  res.status(200).json({
    status: "success",
    message: "Comments retrieved successfully",
    data: {
      comments,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to update this comment", 401)
    );
  }

  const commentData = {
    content: req.body.content,
  };

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    commentData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Comment updated successfully",
    data: {
      comment: updatedComment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to delete this comment", 401)
    );
  }

  await Comment.findByIdAndDelete(req.params.commentId);

  res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
    data: null,
  });
});
