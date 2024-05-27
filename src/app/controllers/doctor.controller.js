import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import Doctor from "../models/doctor.model.js";

export const createDoctor = catchAsync(async (req, res, next) => {
  const doctorData = filterObj(
    req.body,
    "name",
    "photo",
    "qualifications",
    "about",
    "specialities",
    "designation",
    "languages",
    "institute",
    "department",
    "appointmentNo",
    "chamberTime",
    "offDays",
    "floorNo",
    "roomNumber",
    "branchNames",
    "bmdcNo",
    "consulatationFee",
    "phone",
    "feesToShowReport"
  );

  doctorData.hospital = req.user.profile;

  const doctor = await Doctor.create(doctorData);

  res.status(201).json({
    status: "success",
    message: "Doctor created successfully",
    data: {
      doctor,
    },
  });
});
