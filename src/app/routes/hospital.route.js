const express = require("express");
const { protect, restrictTo } = require("../controllers/auth.controller.js");

const {
  createHospital,
  getAdminHospitals,
  getHospitalById,
  getHospitals,
  updateHospital,
} = require("../controllers/hospital.controller.js");

const hospitalRouter = express.Router();

hospitalRouter.get("/", getHospitals);

hospitalRouter.post("/", protect, restrictTo("admin"), createHospital);
hospitalRouter.get("/admin", protect, restrictTo("admin"), getAdminHospitals);
hospitalRouter.patch("/", protect, restrictTo("hospital"), updateHospital);

hospitalRouter.route("/:hospitalId").get(getHospitalById);

module.exports = hospitalRouter;
