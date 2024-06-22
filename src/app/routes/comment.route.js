const express = require("express");
const { protect } = require("../controllers/auth.controller.js");

const {
  createComment,
  deleteComment,
  getAllComments,
  getCommentsByBlog,
  updateComment,
} = require("../controllers/comment.controller.js");

const commentRouter = express.Router();

commentRouter.get("/:blogId", getCommentsByBlog);

commentRouter.route("/").get(getAllComments).post(protect, createComment);

commentRouter
  .route("/:commentId")
  .patch(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = commentRouter;
