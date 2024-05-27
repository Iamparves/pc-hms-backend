import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import {
  createNewBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getBlog,
  likeBlog,
  updateBlog,
} from "../controllers/blog.controller.js";

const blogRouter = express.Router();

blogRouter.patch("/:blogId/like", protect, likeBlog);
blogRouter.patch("/:blogId/dislike", protect, dislikeBlog);

blogRouter
  .route("/")
  .get(getAllBlogs)
  .post(protect, restrictTo("admin", "hospital"), createNewBlog);

blogRouter
  .route("/:blogId")
  .get(getBlog)
  .patch(protect, restrictTo("admin", "hospital"), updateBlog)
  .delete(protect, restrictTo("admin", "hospital"), deleteBlog);

export default blogRouter;
