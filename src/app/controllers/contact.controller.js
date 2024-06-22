const config = require("../../config/index");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const sendEmail = require("../../utils/email");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !message) {
    return next(new AppError("Please provide your name and message", 400));
  }

  await sendEmail(res, {
    email: config.EMAIL_TO,
    subject: "New message from Patientoo contact form",
    message: `Name: ${name}\nEmail: ${email || ""}\nSubject: ${
      subject || ""
    }\nMessage: ${message}`,
  });
});
