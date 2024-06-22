const express = require("express");
const { protect, restrictTo } = require("../controllers/auth.controller.js");

const {
  createNewNotice,
  deleteNotice,
  getAllNotices,
  getNotice,
  updateNotice,
} = require("../controllers/notice.controller.js");

const noticeRouter = express.Router();

noticeRouter.get("/", getAllNotices);

noticeRouter.use(protect);

noticeRouter.route("/").post(restrictTo("admin"), createNewNotice);

noticeRouter
  .route("/:noticeId")
  .get(getNotice)
  .patch(restrictTo("admin"), updateNotice)
  .delete(restrictTo("admin"), deleteNotice);

module.exports = noticeRouter;
