const APIFeaturesQuery = require("../../utils/apiFeaturesQuery");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const filterObj = require("../../utils/filterObj");
const generateDayId = require("../../utils/generateDayId");
const Appointment = require("../models/appointment.model");
const Patient = require("../models/patient.model");
const User = require("../models/user.model");

exports.createNewAppointment = catchAsync(async (req, res, next) => {
  const patient = req.user._id;

  const appointmentData = filterObj(
    req.body,
    "doctor",
    "hospital",
    "appointmentDate",
    "remarks"
  );

  const appointment = await Appointment.create({
    ...appointmentData,
    patient,
  });

  res.status(201).json({
    status: "success",
    message: "Appointment created successfully",
    data: {
      appointment,
    },
  });
});

exports.getAppointments = catchAsync(async (req, res, next) => {
  if (req.user.role === "patient") {
    req.query.patient = req.user._id;
  } else if (req.user.role === "hospital") {
    req.query.hospital = req.user.profile;
  }

  const features = new APIFeaturesQuery(Appointment.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const appointments = await features.query;

  res.status(200).json({
    status: "success",
    message: "Appointments fetched successfully",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

exports.getAppointmentById = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.appointmentId);

  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  if (
    req.user.role === "patient" &&
    appointment.patient.toString() !== req.user._id.toString()
  ) {
    return next(
      new AppError("You are not authorized to view this appointment", 403)
    );
  } else if (
    req.user.role === "hospital" &&
    appointment.hospital.toString() !== req.user.profile.toString()
  ) {
    return next(
      new AppError("You are not authorized to view this appointment", 403)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Appointment fetched successfully",
    data: {
      appointment,
    },
  });
});

const hspCrtAppointment = async (appointmentData, res) => {
  const appointment = await Appointment.create(appointmentData);

  res.status(201).json({
    status: "success",
    message: "Appointment created successfully",
    data: {
      appointment,
    },
  });
};

exports.hospitalCreateAppointment = catchAsync(async (req, res, next) => {
  const hospital = req.user.profile;

  const appointmentData = filterObj(
    req.body,
    "doctor",
    "appointmentDate",
    "remarks"
  );

  const userData = filterObj(req.body, "name", "mobileNo");

  const existingPatient = await User.findOne({
    mobileNo: userData.mobileNo,
  });

  if (existingPatient && existingPatient.role !== "patient") {
    return next(new AppError("User is not a patient", 400));
  }

  if (existingPatient) {
    const existingAppointment = await Appointment.findOne({
      doctor: appointmentData.doctor,
      patient: existingPatient._id,
      dayId: generateDayId(new Date(appointmentData.appointmentDate)),
    });

    if (existingAppointment) {
      return next(
        new AppError(
          "Appointment already exists for the patient on the given date",
          400
        )
      );
    }

    hspCrtAppointment(
      {
        ...appointmentData,
        patient: existingPatient._id,
        hospital,
      },
      res
    );
  }

  const patient = await Patient.create({
    name: userData.name,
  });

  if (!patient) {
    return next(new AppError("Patient creation failed", 400));
  }

  const randomPassword = Math.random().toString(36).slice(-8);

  const user = await User.create({
    ...userData,
    profile: patient._id,
    profileModel: "Patient",
    isVerified: true,
    password: randomPassword,
    confirmPassword: randomPassword,
  });

  if (!user) {
    return next(new AppError("Patient creation failed", 400));
  }

  hspCrtAppointment(
    {
      ...appointmentData,
      patient: user._id,
      hospital,
    },
    res
  );
});
