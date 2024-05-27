import express from "express";
import { createNewAppointment } from "../controllers/appointment.controller.js";
import { protect, restrictTo } from "../controllers/auth.controller.js";

const appointmentRouter = express.Router();

appointmentRouter.post(
  "/",
  protect,
  restrictTo("patient"),
  createNewAppointment
);

export default appointmentRouter;
