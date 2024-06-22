const express = require("express");
const { protect, restrictTo } = require("../controllers/auth.controller.js");

const {
  getAdminOverview,
  getHospitalOverview,
  getPatientOverview,
} = require("../controllers/overview.controller.js");

const overviewRouter = express.Router();

overviewRouter.get("/admin", protect, restrictTo("admin"), getAdminOverview);
overviewRouter.get(
  "/hospital",
  protect,
  restrictTo("hospital"),
  getHospitalOverview
);
overviewRouter.get(
  "/patient",
  protect,
  restrictTo("patient"),
  getPatientOverview
);

module.exports = overviewRouter;
