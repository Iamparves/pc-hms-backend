const express = require("express");

const {
  createNewAppointment,
  getAppointmentById,
  getAppointments,
} = require("../controllers/appointment.controller.js");

const { protect, restrictTo } = require("../controllers/auth.controller.js");

const appointmentRouter = express.Router();

appointmentRouter.post(
  "/",
  protect,
  restrictTo("patient"),
  createNewAppointment
);

appointmentRouter.get("/", protect, getAppointments);

appointmentRouter.get("/:appointmentId", protect, getAppointmentById);

module.exports = appointmentRouter;
