import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import globalErrorHander from "./app/controllers/error.controller.js";
import appointmentRouter from "./app/routes/appointment.route.js";
import doctorRouter from "./app/routes/doctor.route.js";
import hospitalRouter from "./app/routes/hospital.route.js";
import noticeRouter from "./app/routes/notice.route.js";
import userRouter from "./app/routes/user.route.js";
import config from "./config/index.js";
import AppError from "./utils/appError.js";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);

  process.exit(1);
});

const app = express();

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hospitals", hospitalRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/notices", noticeRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API! 🚀",
  });
});

// 404 route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHander);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});

export default app;
