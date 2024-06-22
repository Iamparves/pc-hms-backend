const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const globalErrorHandler = require("./app/controllers/error.controller.js");
const appointmentRouter = require("./app/routes/appointment.route.js");
const blogRouter = require("./app/routes/blog.route.js");
const commentRouter = require("./app/routes/comment.route.js");
const contactRouter = require("./app/routes/contact.route.js");
const doctorRouter = require("./app/routes/doctor.route.js");
const hospitalRouter = require("./app/routes/hospital.route.js");
const noticeRouter = require("./app/routes/notice.route.js");
const overviewRouter = require("./app/routes/overview.route.js");
const userRouter = require("./app/routes/user.route.js");
const config = require("./config/index.js");
const AppError = require("./utils/appError.js");
const express = require("express");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);

  process.exit(1);
});

const app = express();

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const corsOptions = {
  origin: config.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/hospitals", hospitalRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/overview", overviewRouter);
app.use("/api/v1/contact", contactRouter);

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

app.use(globalErrorHandler);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
