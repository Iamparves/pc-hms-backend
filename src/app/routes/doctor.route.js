import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import { createDoctor } from "../controllers/doctor.controller.js";

const doctorRouter = express.Router();

doctorRouter.post("/", protect, restrictTo("hospital"), createDoctor);

export default doctorRouter;
