import express from "express";
import { protect, restrictTo } from "../controllers/auth.controller.js";
import { updateHospital } from "../controllers/hospital.controller.js";

const hospitalRouter = express.Router();

hospitalRouter.patch("/", protect, restrictTo("hospital"), updateHospital);

export default hospitalRouter;
