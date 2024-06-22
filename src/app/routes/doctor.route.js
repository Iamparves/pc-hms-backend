const express = require("express");
const { protect, restrictTo } = require("../controllers/auth.controller.js");

const {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  getHospitalDoctors,
  getSpecialities,
  updateDoctor,
} = require("../controllers/doctor.controller.js");

const doctorRouter = express.Router();

doctorRouter.get("/specialities", getSpecialities);

doctorRouter.get(
  "/my-doctors",
  protect,
  restrictTo("hospital"),
  getHospitalDoctors
);

doctorRouter
  .route("/")
  .get(getAllDoctors)
  .post(protect, restrictTo("hospital"), createDoctor);

doctorRouter
  .route("/:doctorId")
  .get(getDoctorById)
  .patch(protect, restrictTo("hospital"), updateDoctor)
  .delete(protect, restrictTo("hospital"), deleteDoctor);

module.exports = doctorRouter;
