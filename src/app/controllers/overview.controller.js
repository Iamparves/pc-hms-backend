const catchAsync = require("../../utils/catchAsync.js");
const Appointment = require("../models/appointment.model.js");
const Blog = require("../models/blog.model.js");
const Comment = require("../models/comment.model.js");
const Doctor = require("../models/doctor.model.js");
const Hospital = require("../models/hospital.model.js");
const Notice = require("../models/notice.model.js");
const Patient = require("../models/patient.model.js");

exports.getAdminOverview = catchAsync(async (req, res, next) => {
  const hospitals = await Hospital.countDocuments();
  const doctors = await Doctor.countDocuments();
  const patients = await Patient.countDocuments();
  const appointments = await Appointment.countDocuments();
  const blogs = await Blog.countDocuments();
  const notices = await Notice.countDocuments();

  res.status(200).json({
    status: "success",
    data: {
      hospitals,
      doctors,
      patients,
      appointments,
      blogs,
      notices,
    },
  });
});

exports.getHospitalOverview = catchAsync(async (req, res, next) => {
  const doctors = await Doctor.countDocuments({ hospital: req.user.profile });
  const appointments = await Appointment.countDocuments({
    hospital: req.user.profile,
  });
  const upcomingAppointments = await Appointment.countDocuments({
    hospital: req.user.profile,
    appointmentDate: { $gte: new Date() },
  });
  const blogs = await Blog.countDocuments({ author: req.user._id });
  const comments = await Comment.countDocuments({ user: req.user._id });
  const notices = await Notice.countDocuments({
    $or: [{ audience: "hospital" }, { audience: "all" }],
  });

  res.status(200).json({
    status: "success",
    data: {
      doctors,
      appointments,
      upcomingAppointments,
      blogs,
      comments,
      notices,
    },
  });
});

exports.getPatientOverview = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.countDocuments({
    patient: req.user._id,
  });
  const upcomingAppointments = await Appointment.countDocuments({
    patient: req.user._id,
    appointmentDate: { $gte: new Date() },
  });
  const notices = await Notice.countDocuments({
    $or: [{ audience: "patient" }, { audience: "all" }],
  });

  res.status(200).json({
    status: "success",
    data: {
      appointments,
      upcomingAppointments,
      notices,
    },
  });
});
