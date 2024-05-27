import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import Appointment from "../models/appointment.model.js";

export const createNewAppointment = catchAsync(async (req, res, next) => {
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
