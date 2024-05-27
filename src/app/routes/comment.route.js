import express from "express";
import { protect } from "../controllers/auth.controller.js";
import {
  createComment,
  deleteComment,
  getCommentsByBlog,
  updateComment,
} from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.get("/:blogId", getCommentsByBlog);

commentRouter.use(protect);

commentRouter.post("/", createComment);
commentRouter.route("/:commentId").patch(updateComment).delete(deleteComment);

export default commentRouter;
